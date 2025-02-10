import { CONFIG } from '../config/constants';

export function generateSlug(length = CONFIG.SLUG_LENGTH) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length }, 
    () => chars[crypto.getRandomValues(new Uint32Array(1))[0] % chars.length]
  ).join("");
}
