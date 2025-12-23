import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AwsS3Service],
  imports: [TypeOrmModule.forFeature([Product])]
})
export class ProductsModule {}
