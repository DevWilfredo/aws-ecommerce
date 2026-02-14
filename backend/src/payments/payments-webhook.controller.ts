import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsWebhookController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('webhook')
    async handleWebhook(@Req() req: any, @Res() res: Response) {
        try {
            const signature = req.headers['stripe-signature'] as string | undefined;
            if (!signature) {
                return res.status(400).send('Missing stripe-signature header');
            }

            // req.body aquí debe ser Buffer (por express.raw en main.ts)
            await this.paymentsService.handleStripeWebhook(req.body, signature);

            return res.json({ received: true });
        } catch (err: any) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}
