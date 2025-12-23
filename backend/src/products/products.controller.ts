import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly awsS3: AwsS3Service,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const { url, key } = await this.awsS3.uploadFile(file);
      createProductDto['imageUrl'] = url;
      createProductDto['imageKey'] = key;
    }
    return this.productsService.create(createProductDto);
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const product = await this.productsService.findOne(id);

    if (file) {
      if (product.imageKey) await this.awsS3.deleteFile(product.imageKey);

      const { url, key } = await this.awsS3.uploadFile(file);
      updateProductDto['imageUrl'] = url;
      updateProductDto['imageKey'] = key;
    }

    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);

    if (product.imageKey) await this.awsS3.deleteFile(product.imageKey);

    return this.productsService.remove(id);
  }
}
