import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UpdateReviewDto } from '../common/dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(AuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Viewer')
  findAll() {
    return this.reviewsService.findAll();
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  update(@Param('id') id: string, @Body() body: UpdateReviewDto) {
    return this.reviewsService.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin', 'Manager')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
