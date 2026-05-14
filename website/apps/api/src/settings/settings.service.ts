import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createAvatar, hashPassword } from '../common/auth.utils';
import { InviteStaffDto, UpdateSettingsDto } from '../common/dto';
import { DataStoreService } from '../data/data-store.service';

@Injectable()
export class SettingsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getSettings() {
    const data = await this.dataStore.getData();
    return {
      ...data.settings,
      team: data.staff.map(({ passwordHash, passwordSalt, ...staff }) => staff),
    };
  }

  async updateSettings(body: UpdateSettingsDto) {
    let updated;
    await this.dataStore.update((draft) => {
      draft.settings = {
        ...draft.settings,
        ...body,
      };
      updated = {
        ...draft.settings,
        team: draft.staff.map(({ passwordHash, passwordSalt, ...staff }) => staff),
      };
    });
    return updated;
  }

  async inviteStaff(body: InviteStaffDto) {
    const credentials = body.password ? hashPassword(body.password) : undefined;
    const staff = {
      id: randomUUID(),
      name: body.name,
      email: body.email,
      role: body.role,
      avatar: createAvatar(body.name),
      lastLogin: 'Never',
      status: body.password ? 'Active' as const : 'Invited' as const,
      passwordSalt: credentials?.salt,
      passwordHash: credentials?.hash,
    };

    await this.dataStore.update((draft) => {
      draft.staff.push(staff);
    });

    const { passwordHash, passwordSalt, ...publicStaff } = staff;
    return publicStaff;
  }

  async removeStaff(id: string) {
    await this.dataStore.update((draft) => {
      const before = draft.staff.length;
      draft.staff = draft.staff.filter((member) => member.id !== id);
      if (draft.staff.length === before) {
        throw new NotFoundException('Team member not found');
      }
    });
    return { success: true };
  }
}
