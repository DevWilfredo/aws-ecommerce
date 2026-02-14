import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cognitoSub: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  lastname?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
