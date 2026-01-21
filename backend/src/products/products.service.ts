import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepo: Repository<ProductImage>,
    private readonly awsS3: AwsS3Service,
  ) { }

  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    const productId = randomUUID();
    const newProduct = this.productsRepo.create({
      ...createProductDto,
      id: productId,
    });
    const product = await this.productsRepo.save(newProduct);

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
        'attributeValues',
        'optionGroups',
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
        'optionGroups',
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
    files: Express.Multer.File[],
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
}
