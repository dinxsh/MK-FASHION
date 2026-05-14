import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function createAvatar(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const hash = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, 'hex');
  return expected.length === hash.length && timingSafeEqual(hash, expected);
}
