import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepo: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const newBrand = this.brandsRepo.create(createBrandDto);
    return this.brandsRepo.save(newBrand);
  }

  async findAll() {
    return this.brandsRepo.find();
  }

  async findOne(id: string) {
    const brand = await this.brandsRepo.findOneBy({ id });

    if (!brand) {
      throw new NotFoundException(`Marca con id ${id} no encontrada.`);
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandsRepo.preload({
      id,
      ...updateBrandDto,
    });

    if (!brand) {
      throw new NotFoundException(`Marca con id ${id} no existe.`);
    }

    return this.brandsRepo.save(brand);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    await this.brandsRepo.remove(brand);
    return { message: `Marca ${id} eliminada correctamente.` };
  }
}
