import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { AttributeDefinition } from './entities/attribute-definition.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { OptionGroup } from './entities/option-group.entity';
import { OptionValue } from './entities/option-value.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AwsS3Service],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      AttributeDefinition,
      ProductAttributeValue,
      OptionGroup,
      OptionValue,
      ProductImage,
    ]),
  ],
})
export class ProductsModule {}
