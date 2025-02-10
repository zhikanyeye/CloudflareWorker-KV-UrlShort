export const CONFIG = {
  // 基础配置
  SLUG_LENGTH: 6,
  MAX_CUSTOM_SLUG_LENGTH: 50,
  MIN_CUSTOM_SLUG_LENGTH: 3,
  
  // 过期时间选项（毫秒）
  EXPIRY_OPTIONS: {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  },

  // 速率限制配置
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    TIME_WINDOW: 60 * 1000, // 1分钟
  },

  // 正则表达式
  REGEX: {
    SLUG: /^[a-zA-Z0-9-_]+$/,
    URL: /^https?:\/\/.+/i,
  },

  // 错误消息
  ERRORS: {
    INVALID_URL: '链接格式无效',
    INVALID_SLUG: '自定义链接格式无效，只能使用字母、数字、横线和下划线',
    SLUG_TOO_SHORT: '自定义链接至少需要3个字符',
    EXPIRED: '链接已过期',
    NOT_FOUND: '链接不存在',
    VISITS_EXCEEDED: '链接访问次数已达上限',
    SERVER_ERROR: '服务器内部错误',
    RATE_LIMIT: '请求过于频繁，请稍后再试',
    INVALID_PASSWORD: '密码错误',
    TURNSTILE_REQUIRED: '请完成人机验证'
  }
};
