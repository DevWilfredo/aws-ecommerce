import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CognitoAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('orders')
@UseGuards(CognitoAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * Cliente crea orden
     */
    @Post()
    create(
        @CurrentUser() user: User,
        @Body() dto: CreateOrderDto,
    ) {
        return this.ordersService.create(user.id, dto);
    }

    /**
     * Cliente lista sus órdenes
     */
    @Get('me')
    findMine(
        @CurrentUser() user: User,
    ) {
        return this.ordersService.findMine(user.id);
    }

    /**
     * Cliente ve detalle
     */
    @Get('me/:id')
    findOneMine(
        @CurrentUser() user: User,
        @Param('id') id: string,
    ) {
        return this.ordersService.findOneMine(user.id, id);
    }

    /**
     * Cliente cancela orden
     */
    @Patch('me/:id/cancel')
    cancelMine(
        @CurrentUser() user: User,
        @Param('id') id: string,
    ) {
        return this.ordersService.cancelMine(user.id, id);
    }

    /**
     * Admin cambia estado
     * (luego puedes meter RolesGuard aquí)
     */
    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, dto);
    }
}
