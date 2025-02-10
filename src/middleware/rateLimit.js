import { CONFIG } from '../config/constants';

export async function checkRateLimit(request) {
  const clientIP = request.headers.get('CF-Connecting-IP');
  const key = `ratelimit:${clientIP}`;
  
  const current = await URL_SHORT_KV.get(key) || '0';
  const count = parseInt(current);
  
  if (count >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    return false;
  }
  
  await URL_SHORT_KV.put(key, String(count + 1), {
    expirationTtl: CONFIG.RATE_LIMIT.TIME_WINDOW / 1000
  });
  
  return true;
}
