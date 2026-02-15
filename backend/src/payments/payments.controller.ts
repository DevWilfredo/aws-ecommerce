import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { CognitoAuthGuard } from 'src/auth/guards/auth.guard';
import { ConfirmCheckoutSessionDto } from './dtos/confirm-checkout-session.dto';

@Controller('payments')
@UseGuards(CognitoAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session')
  createCheckoutSession(@Req() req: any, @Body() dto: CreateCheckoutSessionDto) {
    return this.paymentsService.createCheckoutSession(req.user.id, dto);
  }

  @Post('confirm-session')
  confirmSession(@Req() req: any, @Body() dto: ConfirmCheckoutSessionDto) {
    return this.paymentsService.confirmCheckoutSession(req.user.id, dto);
  }
}
