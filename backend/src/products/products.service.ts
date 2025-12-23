import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const newProduct = this.productsRepo.create(createProductDto);
    return await this.productsRepo.save(newProduct);
  }

  async findAll() {
    return await this.productsRepo.find();
  }

  async findOne(id: string) {
    const product = await this.productsRepo.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepo.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no existe.`);
    }

    return await this.productsRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepo.remove(product);
    return { message: `Producto ${id} eliminado correctamente.` };
  }
}
