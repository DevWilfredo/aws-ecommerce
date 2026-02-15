import { Controller, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    try {
      const signature = req.headers['stripe-signature'] as string | undefined;
      if (!signature) {
        return res.status(400).send('Missing stripe-signature header');
      }

      const rawBody = Buffer.isBuffer(req.rawBody)
        ? req.rawBody
        : Buffer.isBuffer(req.body)
          ? req.body
          : null;

      if (!rawBody) {
        return res.status(400).send('Missing raw body for Stripe signature verification');
      }

      await this.paymentsService.handleStripeWebhook(rawBody, signature);

      return res.json({ received: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown webhook error';
      return res.status(400).send(`Webhook Error: ${message}`);
    }
  }
}
