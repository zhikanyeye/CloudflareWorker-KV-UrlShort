import { CONFIG } from '../config/constants';
import { validateURL, validateSlug } from '../utils/url';
import { generateSlug } from '../utils/slug';
import { createJSONResponse } from '../utils/response';
import { verifyPassword } from '../middleware/security';

export async function handleShortenURL(request) {
  const { url, slug, expiry, password, maxVisits, token } = await request.json();
  
  if (!url) {
    return createJSONResponse({ error: '请输入链接地址' }, 400);
  }
  
  const sanitizedURL = validateURL(url);
  const shortSlug = slug || generateSlug();
  
  if (slug) {
    validateSlug(slug);
  }
  
  // 检查slug是否已存在
  const existing = await URL_SHORT_KV.get(shortSlug);
  if (existing) {
    return createJSONResponse({ error: '该自定义链接已被使用' }, 400);
  }
  
  // 存储URL数据
  const data = {
    url: sanitizedURL,
    created: Date.now(),
    ...(expiry && { expiry: new Date(expiry).getTime() }),
    ...(password && { password }),
    ...(maxVisits && { 
      maxVisits: parseInt(maxVisits),
      visits: 0
    })
  };
  
  await URL_SHORT_KV.put(shortSlug, JSON.stringify(data));
  
  return createJSONResponse({
    shortened: `${new URL(request.url).origin}/${shortSlug}`
  });
}

export async function handleVerifyPassword(request, slug) {
  const { password, token } = await request.json();
  
  const record = await URL_SHORT_KV.get(slug);
  if (!record) {
    return createJSONResponse({ error: CONFIG.ERRORS.NOT_FOUND }, 404);
  }
  
  const data = JSON.parse(record);
  
  if (await verifyPassword(password, data.password)) {
    // 更新访问计数
    if (data.maxVisits) {
      data.visits = (data.visits || 0) + 1;
      await URL_SHORT_KV.put(slug, JSON.stringify(data));
    }
    
    return createJSONResponse({
      success: true,
      url: data.url
    });
  }
  
  return createJSONResponse({
    success: false,
    error: CONFIG.ERRORS.INVALID_PASSWORD
  }, 401);
}
