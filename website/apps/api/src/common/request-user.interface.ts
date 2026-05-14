import type { AdminRole } from './types';

export interface RequestUser {
  sub: string;
  email: string;
  role: AdminRole;
}
