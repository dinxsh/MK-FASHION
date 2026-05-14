import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UpdateCustomerDto } from '../common/dto';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(AuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Viewer')
  findAll() {
    return this.customersService.findAll();
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  update(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
    return this.customersService.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
