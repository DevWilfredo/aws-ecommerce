import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionGroup } from './entities/option-group.entity';
import { OptionValue } from './entities/option-value.entity';
import { Product } from './entities/product.entity';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';

@Injectable()
export class OptionGroupsService {
  constructor(
    @InjectRepository(OptionGroup)
    private readonly optionGroupsRepo: Repository<OptionGroup>,
    @InjectRepository(OptionValue)
    private readonly optionValuesRepo: Repository<OptionValue>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(createOptionGroupDto: CreateOptionGroupDto) {
    const newGroup = this.optionGroupsRepo.create(createOptionGroupDto);
    return this.optionGroupsRepo.save(newGroup);
  }

  async findAll() {
    return this.optionGroupsRepo.find({
      relations: ['category', 'optionValues'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const optionGroup = await this.optionGroupsRepo.findOne({
      where: { id },
      relations: ['category', 'optionValues'],
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group con id ${id} no encontrado.`);
    }

    return optionGroup;
  }

  async update(id: string, updateOptionGroupDto: UpdateOptionGroupDto) {
    const optionGroup = await this.optionGroupsRepo.preload({
      id,
      ...updateOptionGroupDto,
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group con id ${id} no existe.`);
    }

    return this.optionGroupsRepo.save(optionGroup);
  }

  async remove(id: string) {
    const optionGroup = await this.optionGroupsRepo.findOne({
      where: { id },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group con id ${id} no existe.`);
    }

    const relatedProducts = await this.productsRepo
      .createQueryBuilder('product')
      .innerJoin('product.optionGroups', 'optionGroup', 'optionGroup.id = :id', {
        id,
      })
      .getCount();

    if (relatedProducts > 0) {
      throw new BadRequestException(
        'No se puede eliminar un option group asignado a productos.',
      );
    }

    await this.optionValuesRepo.delete({ optionGroupId: id });
    await this.optionGroupsRepo.remove(optionGroup);
    return { message: `Option group ${id} eliminado correctamente.` };
  }
}
