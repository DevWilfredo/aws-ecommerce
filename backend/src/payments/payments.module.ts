import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/catalog/products/entities/product.entity';
import { PaymentsWebhookController } from './payments-webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product])],
  providers: [PaymentsService],
  controllers: [PaymentsController, PaymentsWebhookController],
})
export class PaymentsModule {}
