import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

import { AttributesModule } from './attributes/attributes.module';
import { OptionsModule } from './options/options.module';
import { AwsS3Module } from '../../aws-s3/aws-s3.module';
import { OptionGroup } from './entities/option-group.entity';
import { AttributeDefinition } from './entities/attribute-definition.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, OptionGroup, AttributeDefinition, ProductAttributeValue]),
    AttributesModule,
    OptionsModule,
    AwsS3Module,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
