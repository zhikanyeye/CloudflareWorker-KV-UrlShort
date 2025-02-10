import { CONFIG } from './config/constants';
import { checkRateLimit } from './middleware/rateLimit';
import { corsHeaders } from './middleware/security';
import { handleShortenURL, handleVerifyPassword } from './handlers/api';
import { serveFrontend } from './handlers/frontend';
import { handleRedirect } from './handlers/redirect';

// 路由映射
const routeHandlers = new Map([
  ['/favicon.ico', () => new Response(null, { status: 204 })],
  ['/', () => serveFrontend('index')],
  ['/api/shorten', handleShortenURL],
  ['/api/verify', handleVerifyPassword]
]);

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }
    
    // 速率限制检查
    if (!(await checkRateLimit(request))) {
      return new Response(CONFIG.ERRORS.RATE_LIMIT, {
        status: 429,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    const url = new URL(request.url);
    const { pathname } = url;
    
    // 查找并执行路由处理器
    for (const [path, handler] of routeHandlers) {
      if (pathname === path || (path.startsWith('/api') && pathname.startsWith(path))) {
        return handler(request);
      }
    }
    
    // 处理重定向
    return handleRedirect(pathname);
  } catch (error) {
    console.error('Request Error:', error);
    return new Response(CONFIG.ERRORS.SERVER_ERROR, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
