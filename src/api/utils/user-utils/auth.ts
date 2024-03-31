import type { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import apiConfig from '@api/utils/config/api_config';

export function generateAccessToken(user: User) {
  return sign(user, process.env.TOKEN_SECRET);
}

/**
 * Calculates the square of a number.
 *
 * @param {string} password
 * @returns {string} HashedPassword await bcrypt.hash(password, 10);
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, apiConfig.HASH_SALT).then((res) => res);
}

/**
 * Calculates the square of a number.
 *
 * @param {User} user
 * @param {string} password
 * @returns {boolean} result await bcrypt.compare(oldPassword, newPassword);
 */
export async function verifyPassword(
  user: User,
  password: string
): Promise<boolean> {
  if (!user) return false;
  return await compare(password, user.password)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error('matchPassword', err);
      return false;
    });
}
