import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { CognitoAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('payments')
@UseGuards(CognitoAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session')
  createCheckoutSession(@Req() req: any, @Body() dto: CreateCheckoutSessionDto) {
    return this.paymentsService.createCheckoutSession(req.user.id, dto);
  }
}
