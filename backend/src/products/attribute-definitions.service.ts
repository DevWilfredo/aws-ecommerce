import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttributeDefinition } from './entities/attribute-definition.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { CreateAttributeDefinitionDto } from './dto/create-attribute-definition.dto';
import { UpdateAttributeDefinitionDto } from './dto/update-attribute-definition.dto';

@Injectable()
export class AttributeDefinitionsService {
  constructor(
    @InjectRepository(AttributeDefinition)
    private readonly attributeDefinitionsRepo: Repository<AttributeDefinition>,
    @InjectRepository(ProductAttributeValue)
    private readonly productAttributeValuesRepo: Repository<ProductAttributeValue>,
  ) {}

  async create(createAttributeDefinitionDto: CreateAttributeDefinitionDto) {
    const newAttribute = this.attributeDefinitionsRepo.create(
      createAttributeDefinitionDto,
    );
    return this.attributeDefinitionsRepo.save(newAttribute);
  }

  async findAll() {
    return this.attributeDefinitionsRepo.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const attribute = await this.attributeDefinitionsRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!attribute) {
      throw new NotFoundException(`Atributo con id ${id} no encontrado.`);
    }

    return attribute;
  }

  async update(id: string, updateAttributeDefinitionDto: UpdateAttributeDefinitionDto) {
    const attribute = await this.attributeDefinitionsRepo.preload({
      id,
      ...updateAttributeDefinitionDto,
    });

    if (!attribute) {
      throw new NotFoundException(`Atributo con id ${id} no existe.`);
    }

    return this.attributeDefinitionsRepo.save(attribute);
  }

  async remove(id: string) {
    const attribute = await this.attributeDefinitionsRepo.findOneBy({ id });

    if (!attribute) {
      throw new NotFoundException(`Atributo con id ${id} no existe.`);
    }

    const relatedValues = await this.productAttributeValuesRepo.count({
      where: { attributeId: id },
    });

    if (relatedValues > 0) {
      throw new BadRequestException(
        'No se puede eliminar un atributo que ya esta usado en productos.',
      );
    }

    await this.attributeDefinitionsRepo.remove(attribute);
    return { message: `Atributo ${id} eliminado correctamente.` };
  }
}
