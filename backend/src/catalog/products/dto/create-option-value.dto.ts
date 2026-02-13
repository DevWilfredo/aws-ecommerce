import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOptionValueDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  label: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El ajuste de precio debe tener hasta 2 decimales' },
  )
  @Min(0)
  priceAdjustment?: number;

  @IsUUID()
  optionGroupId: string;
}
