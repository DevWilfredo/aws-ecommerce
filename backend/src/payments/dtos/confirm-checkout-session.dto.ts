import { IsUUID, IsString, MinLength } from 'class-validator';

export class ConfirmCheckoutSessionDto {
  @IsUUID()
  orderId: string;

  @IsString()
  @MinLength(8)
  sessionId: string;
}
