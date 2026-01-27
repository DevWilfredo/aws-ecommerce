import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Multer.File[],
  ) {
    return this.productsService.create(createProductDto, files ?? []);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Multer.File[],
  ) {
    return this.productsService.update(id, updateProductDto, files ?? []);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async addImages(
    @Param('id') id: string,
    @UploadedFiles() files: Multer.File[],
  ) {
    return this.productsService.addImages(id, files ?? []);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
