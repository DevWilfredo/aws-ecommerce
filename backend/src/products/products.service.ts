import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Multer } from 'multer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { randomUUID } from 'crypto';
import { OptionGroup } from './entities/option-group.entity';
import { AttributeDefinition, AttributeDataType } from './entities/attribute-definition.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepo: Repository<ProductImage>,
    @InjectRepository(OptionGroup)
    private readonly optionGroupsRepo: Repository<OptionGroup>,
    @InjectRepository(AttributeDefinition)
    private readonly attributeDefinitionsRepo: Repository<AttributeDefinition>,
    @InjectRepository(ProductAttributeValue)
    private readonly productAttributeValuesRepo: Repository<ProductAttributeValue>,
    private readonly awsS3: AwsS3Service,
  ) { }

  async create(
    createProductDto: CreateProductDto,
    files: Multer.File[] = [],
  ) {
    const productId = randomUUID();
    const { optionGroupIds, attributeValues, ...productData } = createProductDto;
    const newProduct = this.productsRepo.create({
      ...productData,
      id: productId,
    });
    const product = await this.productsRepo.save(newProduct);

    if (optionGroupIds?.length) {
      const optionGroups = await this.optionGroupsRepo.find({
        where: { id: In(optionGroupIds) },
      });
      if (optionGroups.length !== optionGroupIds.length) {
        const foundIds = new Set(optionGroups.map((group) => group.id));
        const missingIds = optionGroupIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Option groups no encontrados: ${missingIds.join(', ')}`,
        );
      }

      const invalidOptionGroups = optionGroups.filter(
        (group) => group.categoryId !== product.categoryId,
      );
      if (invalidOptionGroups.length) {
        throw new BadRequestException(
          'Todos los option groups deben pertenecer a la misma categoría del producto.',
        );
      }

      await this.productsRepo.save({
        id: productId,
        optionGroups,
      });
    }

    if (attributeValues?.length) {
      const attributeIds = Array.from(
        new Set(attributeValues.map((value) => value.attributeId)),
      );
      const attributes = await this.attributeDefinitionsRepo.find({
        where: { id: In(attributeIds) },
      });
      if (attributes.length !== attributeIds.length) {
        const foundIds = new Set(attributes.map((attribute) => attribute.id));
        const missingIds = attributeIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Atributos no encontrados: ${missingIds.join(', ')}`,
        );
      }

      const invalidAttributes = attributes.filter(
        (attribute) => attribute.categoryId !== product.categoryId,
      );
      if (invalidAttributes.length) {
        throw new BadRequestException(
          'Todos los atributos deben pertenecer a la misma categoría del producto.',
        );
      }

      const attributeMap = new Map(
        attributes.map((attribute) => [attribute.id, attribute]),
      );

      const valuesToSave = attributeValues.map((value) => {
        const attribute = attributeMap.get(value.attributeId);
        if (!attribute) {
          throw new NotFoundException(
            `Atributo ${value.attributeId} no encontrado.`,
          );
        }

        switch (attribute.dataType) {
          case AttributeDataType.Text:
            if (value.valueText === undefined || value.valueText === null) {
              throw new BadRequestException(
                `El atributo ${attribute.name} requiere un valor de texto.`,
              );
            }
            break;
          case AttributeDataType.Number:
            if (value.valueNumber === undefined || value.valueNumber === null) {
              throw new BadRequestException(
                `El atributo ${attribute.name} requiere un valor numérico.`,
              );
            }
            break;
          case AttributeDataType.Boolean:
            if (value.valueBoolean === undefined || value.valueBoolean === null) {
              throw new BadRequestException(
                `El atributo ${attribute.name} requiere un valor booleano.`,
              );
            }
            break;
        }

        return this.productAttributeValuesRepo.create({
          productId,
          attributeId: attribute.id,
          valueText: value.valueText,
          valueNumber: value.valueNumber,
          valueBoolean: value.valueBoolean,
        });
      });

      await this.productAttributeValuesRepo.save(valuesToSave);
    }

    if (files.length) {
      const uploads = await this.awsS3.uploadFiles(
        files,
        `products/${productId}`,
      );
      const images = uploads.map((upload, index) =>
        this.productImagesRepo.create({
          productId,
          imageUrl: upload.url,
          imageKey: upload.key,
          isFeatured: index === 0,
          position: index,
        }),
      );
      await this.productImagesRepo.save(images);
    }

    return this.findOne(product.id);
  }

  async findAll() {
    return await this.productsRepo.find({
      relations: [
        'brand',
        'category',
        'images',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: [
        'brand',
        'category',
        'images',
        'attributeValues',
        'attributeValues.attribute',
        'optionGroups',
        'optionGroups.optionValues',
      ],
      order: { images: { position: 'ASC' } },
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado.`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Multer.File[] = [],
  ) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no existe.`);
    }

    this.productsRepo.merge(product, updateProductDto);
    const savedProduct = await this.productsRepo.save(product);

    if (files.length) {
      const keysToDelete = product.images
        .map((image) => image.imageKey)
        .filter((key) => Boolean(key));

      if (keysToDelete.length) {
        await this.awsS3.deleteFiles(keysToDelete as string[]);
      }

      await this.productImagesRepo.delete({ productId: id });

      const uploads = await this.awsS3.uploadFiles(files, `products/${id}`);
      const images = uploads.map((upload, index) =>
        this.productImagesRepo.create({
          productId: id,
          imageUrl: upload.url,
          imageKey: upload.key,
          isFeatured: index === 0,
          position: index,
        }),
      );
      await this.productImagesRepo.save(images);
    }

    return this.findOne(savedProduct.id);
  }

  async remove(id: string) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no existe.`);
    }

    const keysToDelete = product.images
      .map((image) => image.imageKey)
      .filter((key) => Boolean(key));

    if (keysToDelete.length) {
      await this.awsS3.deleteFiles(keysToDelete as string[]);
    }

    await this.productImagesRepo.delete({ productId: id });
    await this.productsRepo.remove(product);
    return { message: `Producto ${id} eliminado correctamente.` };
  }

  async addImages(id: string, files: Multer.File[] = []) {
    if (!files.length) {
      throw new BadRequestException('Debe enviar al menos una imagen.');
    }

    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no existe.`);
    }

    const uploads = await this.awsS3.uploadFiles(files, `products/${id}`);
    const currentCount = product.images?.length ?? 0;

    const images = uploads.map((upload, index) =>
      this.productImagesRepo.create({
        productId: id,
        imageUrl: upload.url,
        imageKey: upload.key,
        isFeatured: currentCount === 0 && index === 0,
        position: currentCount + index,
      }),
    );
    await this.productImagesRepo.save(images);

    return this.findOne(id);
  }
}
