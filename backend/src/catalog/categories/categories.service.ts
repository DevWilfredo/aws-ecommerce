import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoriesRepo.create(createCategoryDto);
    return this.categoriesRepo.save(newCategory);
  }

  async findAll() {
    return this.categoriesRepo.find();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada.`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepo.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`Categoria con id ${id} no existe.`);
    }

    return this.categoriesRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoriesRepo.remove(category);
    return { message: `Categoria ${id} eliminada correctamente.` };
  }
}
