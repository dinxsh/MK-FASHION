import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ChangePasswordDto, LoginDto } from '../common/dto';
import type { RequestUser } from '../common/request-user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.login(body.email, body.password);
    response.cookie('mk_admin_token', session.token, this.authService.getCookieOptions());
    return { user: session.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('mk_admin_token', {
      ...this.authService.getCookieOptions(),
      maxAge: 0,
    });
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: RequestUser) {
    const current = await this.authService.getUserById(user.sub);
    if (!current) {
      throw new UnauthorizedException('Session is no longer valid');
    }
    return current;
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@CurrentUser() user: RequestUser, @Body() body: ChangePasswordDto) {
    await this.authService.changePassword(user.sub, body.currentPassword, body.newPassword);
    return { success: true };
  }
}
