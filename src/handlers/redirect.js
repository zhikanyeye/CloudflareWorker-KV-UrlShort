import { CONFIG } from '../config/constants';
import { createHTMLResponse } from '../utils/response';
import { serveFrontend } from './frontend';

export async function handleRedirect(pathname) {
  try {
    const slug = pathname.slice(1);
    const record = await URL_SHORT_KV.get(slug);
    
    if (!record) {
      return new Response(CONFIG.ERRORS.NOT_FOUND, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    const data = JSON.parse(record);
    const { url, expiry, password, maxVisits, visits = 0 } = data;
    
    // 检查是否过期
    if (expiry && Date.now() > expiry) {
      await URL_SHORT_KV.delete(slug);
      return new Response(CONFIG.ERRORS.EXPIRED, { 
        status: 410,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    // 检查访问次数
    if (maxVisits && visits >= maxVisits) {
      await URL_SHORT_KV.delete(slug);
      return new Response(CONFIG.ERRORS.VISITS_EXCEEDED, { 
        status: 410,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    // 如果需要密码，返回密码输入页面
    if (password) {
      return serveFrontend('password', { slug });
    }
    
    // 更新访问计数
    if (maxVisits) {
      data.visits = visits + 1;
      await URL_SHORT_KV.put(slug, JSON.stringify(data));
    }
    
    return Response.redirect(url, 302);
  } catch (error) {
    console.error('Redirect Error:', error);
    return new Response(CONFIG.ERRORS.SERVER_ERROR, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
