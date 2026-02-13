import { Transform, Type, plainToInstance } from 'class-transformer';
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

const parseJsonElement = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
};

const normalizeToArray = (value: unknown) => {
  if (value === undefined || value === null) return value;
  return Array.isArray(value) ? value : [value];
};

const parseJsonValue = (value: unknown) => {
  const parsed = parseJsonElement(value);
  if (Array.isArray(parsed)) {
    return parsed.map(parseJsonElement);
  }
  return parsed;
};

const parseJsonArrayValue = (value: unknown) => {
  const parsed = parseJsonValue(value);
  const normalized = normalizeToArray(parsed);
  if (!Array.isArray(normalized)) return normalized;
  return normalized.flatMap((item) => {
    const parsedItem = parseJsonValue(item);
    return Array.isArray(parsedItem) ? parsedItem : [parsedItem];
  });
};

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
  @Transform(({ value }) => parseJsonArrayValue(value))
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  optionGroupIds?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = parseJsonArrayValue(value);
    if (!Array.isArray(parsed)) return parsed;
    return parsed.map((item) =>
      plainToInstance(CreateProductAttributeValueDto, item),
    );
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeValueDto)
  attributeValues?: CreateProductAttributeValueDto[];
}
