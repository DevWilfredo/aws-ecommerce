import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';



import { AttributeDefinition } from '../entities/attribute-definition.entity';
import { ProductAttributeValue } from '../entities/product-attribute-value.entity';
import { AttributeDefinitionsController } from './attribute-definitions.controller';
import { AttributeDefinitionsService } from './attribute-definitions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeDefinition, ProductAttributeValue]),
  ],
  controllers: [AttributeDefinitionsController],
  providers: [AttributeDefinitionsService],
  exports: [AttributeDefinitionsService],
})
export class AttributesModule {}
