import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.mk_admin_token ?? this.extractBearerToken(request.headers?.authorization);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = this.authService.verifyToken(token);
    return true;
  }

  private extractBearerToken(authHeader?: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      return undefined;
    }

    return authHeader.slice('Bearer '.length);
  }
}
