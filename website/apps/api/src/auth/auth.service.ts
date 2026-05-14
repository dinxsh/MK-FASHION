import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { DataStoreService } from '../data/data-store.service';
import type { AuthUser, StaffRecord } from '../common/types';
import type { RequestUser } from '../common/request-user.interface';
import { hashPassword, verifyPassword } from '../common/auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataStore: DataStoreService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const data = await this.dataStore.getData();
    const user = data.staff.find((member) => member.email.toLowerCase() === email.toLowerCase());

    if (!user?.passwordHash || !user.passwordSalt || user.status !== 'Active') {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.dataStore.update((draft) => {
      const target = draft.staff.find((member) => member.id === user.id);
      if (target) {
        target.lastLogin = new Date().toISOString();
      }
    });

    return {
      token: this.signToken(user),
      user: this.toAuthUser({ ...user, lastLogin: new Date().toISOString() }),
    };
  }

  async getUserById(id: string) {
    const data = await this.dataStore.getData();
    const user = data.staff.find((member) => member.id === id);
    return user ? this.toAuthUser(user) : null;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const data = await this.dataStore.getData();
    const user = data.staff.find((member) => member.id === userId);

    if (!user?.passwordHash || !user.passwordSalt) {
      throw new UnauthorizedException('Invalid user');
    }

    if (!verifyPassword(currentPassword, user.passwordSalt, user.passwordHash)) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const credentials = hashPassword(newPassword);
    await this.dataStore.update((draft) => {
      const target = draft.staff.find((member) => member.id === userId);
      if (target) {
        target.passwordSalt = credentials.salt;
        target.passwordHash = credentials.hash;
      }
    });
  }

  verifyToken(token: string): RequestUser {
    try {
      return verify(token, this.jwtSecret()) as RequestUser;
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }

  getCookieOptions() {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    const maxAge = Number(this.configService.get<string>('AUTH_COOKIE_MAX_AGE_MS') || 604800000);

    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure,
      path: '/',
      maxAge,
    };
  }

  private signToken(user: StaffRecord) {
    const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') || '7d') as SignOptions['expiresIn'];
    return sign(
      { sub: user.id, email: user.email, role: user.role },
      this.jwtSecret(),
      { expiresIn },
    );
  }

  private toAuthUser(user: StaffRecord): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
    };
  }

  private jwtSecret() {
    return this.configService.get<string>('JWT_SECRET') || 'mk-fashion-dev-secret-change-me';
  }
}
