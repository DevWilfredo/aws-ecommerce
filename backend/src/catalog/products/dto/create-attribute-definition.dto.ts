import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { AttributeDataType } from '../entities/attribute-definition.entity';

export class CreateAttributeDefinitionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  unit?: string;

  @IsOptional()
  @IsEnum(AttributeDataType)
  dataType?: AttributeDataType;

  @IsUUID()
  categoryId: string;
}
