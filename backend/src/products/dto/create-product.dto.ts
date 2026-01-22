import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsUUID,
  IsInt,
  ValidateNested,
} from 'class-validator';

export class CreateProductAttributeValueDto {
  @IsUUID()
  attributeId: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  valueText?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El valor numérico debe tener hasta 2 decimales' },
  )
  valueNumber?: number;

  @IsOptional()
  @IsBoolean()
  valueBoolean?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser numérico con hasta 2 decimales' },
  )
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  brandId: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  optionGroupIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeValueDto)
  attributeValues?: CreateProductAttributeValueDto[];
}
