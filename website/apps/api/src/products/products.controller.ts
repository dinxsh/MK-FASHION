import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { ProductDto } from '../common/dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Viewer')
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Manager', 'Viewer')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('Admin', 'Manager')
  create(@Body() body: ProductDto) {
    return this.productsService.create(body);
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  update(@Param('id') id: string, @Body() body: ProductDto) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
