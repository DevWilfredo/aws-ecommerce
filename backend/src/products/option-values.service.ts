import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionValue } from './entities/option-value.entity';
import { OptionGroup } from './entities/option-group.entity';
import { CreateOptionValueDto } from './dto/create-option-value.dto';
import { UpdateOptionValueDto } from './dto/update-option-value.dto';

@Injectable()
export class OptionValuesService {
  constructor(
    @InjectRepository(OptionValue)
    private readonly optionValuesRepo: Repository<OptionValue>,
    @InjectRepository(OptionGroup)
    private readonly optionGroupsRepo: Repository<OptionGroup>,
  ) {}

  async create(createOptionValueDto: CreateOptionValueDto) {
    const optionGroup = await this.optionGroupsRepo.findOneBy({
      id: createOptionValueDto.optionGroupId,
    });

    if (!optionGroup) {
      throw new NotFoundException(
        `Option group con id ${createOptionValueDto.optionGroupId} no existe.`,
      );
    }

    const newValue = this.optionValuesRepo.create(createOptionValueDto);
    return this.optionValuesRepo.save(newValue);
  }

  async findAll() {
    return this.optionValuesRepo.find({
      relations: ['optionGroup', 'optionGroup.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const optionValue = await this.optionValuesRepo.findOne({
      where: { id },
      relations: ['optionGroup', 'optionGroup.category'],
    });

    if (!optionValue) {
      throw new NotFoundException(`Option value con id ${id} no encontrado.`);
    }

    return optionValue;
  }

  async update(id: string, updateOptionValueDto: UpdateOptionValueDto) {
    if (updateOptionValueDto.optionGroupId) {
      const optionGroup = await this.optionGroupsRepo.findOneBy({
        id: updateOptionValueDto.optionGroupId,
      });

      if (!optionGroup) {
        throw new NotFoundException(
          `Option group con id ${updateOptionValueDto.optionGroupId} no existe.`,
        );
      }
    }

    const optionValue = await this.optionValuesRepo.preload({
      id,
      ...updateOptionValueDto,
    });

    if (!optionValue) {
      throw new NotFoundException(`Option value con id ${id} no existe.`);
    }

    return this.optionValuesRepo.save(optionValue);
  }

  async remove(id: string) {
    const optionValue = await this.optionValuesRepo.findOneBy({ id });

    if (!optionValue) {
      throw new NotFoundException(`Option value con id ${id} no existe.`);
    }

    await this.optionValuesRepo.remove(optionValue);
    return { message: `Option value ${id} eliminado correctamente.` };
  }
}
