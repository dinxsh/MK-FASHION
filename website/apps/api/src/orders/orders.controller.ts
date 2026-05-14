import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UpdateOrderDto } from '../common/dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Viewer')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Manager', 'Viewer')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.ordersService.update(id, body);
  }
}
