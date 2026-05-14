import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { CouponDto, UpdateCouponDto } from '../common/dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CouponsService } from './coupons.service';

@Controller('coupons')
@UseGuards(AuthGuard, RolesGuard)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Viewer')
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  @Roles('Admin', 'Manager')
  create(@Body() body: CouponDto) {
    return this.couponsService.create(body);
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  update(@Param('id') id: string, @Body() body: UpdateCouponDto) {
    return this.couponsService.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
