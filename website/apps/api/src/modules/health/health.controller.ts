import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getApiRoot() {
    return this.healthService.getHealth();
  }

  @Get('health')
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('health/dependencies')
  async getDependenciesHealth() {
    return this.healthService.getDependenciesHealth();
  }
}
