import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { InviteStaffDto, UpdateSettingsDto } from '../common/dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(AuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Viewer')
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @Roles('Admin', 'Manager')
  updateSettings(@Body() body: UpdateSettingsDto) {
    return this.settingsService.updateSettings(body);
  }

  @Post('team')
  @Roles('Admin')
  inviteStaff(@Body() body: InviteStaffDto) {
    return this.settingsService.inviteStaff(body);
  }

  @Delete('team/:id')
  @Roles('Admin')
  removeStaff(@Param('id') id: string) {
    return this.settingsService.removeStaff(id);
  }
}
