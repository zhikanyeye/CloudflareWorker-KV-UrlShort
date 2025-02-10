import { CONFIG } from '../config/constants';
import { createHTMLResponse } from '../utils/response';

export function serveFrontend(page = 'index', options = {}) {
  switch (page) {
    case 'index':
      return createHTMLResponse(getIndexHTML());
    case 'password':
      return createHTMLResponse(getPasswordHTML(options.slug));
    default:
      return new Response('页面不存在', { status: 404 });
  }
}

function getIndexHTML() {
  const turnstileScript = TURNSTILE_SITE_KEY ? 
    '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : 
    '';

  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>短链接生成器</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>">
    ${turnstileScript}
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <main class="container mx-auto p-6 max-w-2xl">
        <div class="text-center mb-12">
            <!-- 标题部分 -->
            <h1 class="text-6xl font-extrabold mb-4">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
                hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 transition-all duration-500">
                    简约短链
                </span>
            </h1>
            <p class="text-gray-600 text-lg mb-4">安全、可靠的链接缩短服务</p>
            
            <!-- GitHub链接 -->
            <a href="https://github.com/zhikanyeye/CloudflareWorker-KV-UrlShort" 
               target="_blank" 
               class="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
                查看源码
            </a>
        </div>
        
        <!-- 主要表单 -->
        <div class="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90">
            <form id="shorten-form" class="space-y-6">
                <!-- URL输入 -->
                <div class="space-y-4">
                    <div>
                        <label for="url" class="block text-sm font-semibold text-gray-700 mb-2">
                            输入链接
                            <span class="text-gray-500 font-normal">（必填）</span>
                        </label>
                        <input id="url" type="url" 
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                            placeholder="https://example.com" required>
                    </div>
                    
                    <!-- 自定义选项 -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <!-- 自定义短链接 -->
                        <div>
                            <label for="slug" class="block text-sm font-semibold text-gray-700 mb-2">
                                自定义短链接
                                <span class="text-gray-500 font-normal">（可选）</span>
                            </label>
                            <input id="slug" type="text" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                                placeholder="自定义链接">
                        </div>
                        
                        <!-- 有效期选择 -->
                        <div>
                            <label for="expiry" class="block text-sm font-semibold text-gray-700 mb-2">
                                有效期
                                <span class="text-gray-500 font-normal">（可选）</span>
                            </label>
                            <select id="expiry" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                                <option value="">永久有效</option>
                                <option value="1h">1小时</option>
                                <option value="24h">24小时</option>
                                <option value="7d">7天</option>
                                <option value="30d">30天</option>
                                <option value="custom">自定义时间</option>
                            </select>
                            <input id="customExpiry" type="datetime-local" 
                                class="hidden w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                        </div>
                    </div>
                    
                    <!-- 安全选项 -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <!-- 访问密码 -->
                        <div>
                            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                                访问密码
                                <span class="text-gray-500 font-normal">（可选）</span>
                            </label>
                            <input id="password" type="password" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                                placeholder="设置密码">
                        </div>
                        
                        <!-- 最大访问次数 -->
                        <div>
                            <label for="maxVisits" class="block text-sm font-semibold text-gray-700 mb-2">
                                最大访问次数
                                <span class="text-gray-500 font-normal">（可选）</span>
                            </label>
                            <input id="maxVisits" type="number" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
                                placeholder="10">
                        </div>
                    </div>
                </div>
                
                <!-- Turnstile验证 -->
                <div class="flex justify-center">
                    ${TURNSTILE_SITE_KEY ? 
                        '<div class="cf-turnstile" data-sitekey="' + TURNSTILE_SITE_KEY + '"></div>' : 
                        ''}
                </div>
                
                <!-- 提交按钮 -->
                <button type="submit" 
                    class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium
                    hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-all duration-200 transform hover:scale-[1.02]">
                    生成短链接
                </button>
            </form>
            
            <!-- 结果显示区域 -->
            <div id="result" class="mt-8"></div>
        </div>
    </main>

    <script>
    // 表单处理
    document.getElementById('shorten-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 获取 Turnstile token
        let token = '';
        try {
            token = turnstile?.getResponse() || '';
        } catch (error) {
            console.error('Turnstile error:', error);
        }
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const resultDiv = document.getElementById('result');
        
        // 禁用提交按钮并显示加载状态
        submitButton.disabled = true;
        submitButton.textContent = '生成中...';
        resultDiv.innerHTML = '';
        
        try {
            // 准备表单数据
            const expiry = document.getElementById('expiry').value;
            let expiryDate = null;

            if (expiry) {
                const now = new Date();
                switch(expiry) {
                    case '1h':
                        expiryDate = new Date(now.getTime() + ${CONFIG.EXPIRY_OPTIONS['1h']});
                        break;
                    case '24h':
                        expiryDate = new Date(now.getTime() + ${CONFIG.EXPIRY_OPTIONS['24h']});
                        break;
                    case '7d':
                        expiryDate = new Date(now.getTime() + ${CONFIG.EXPIRY_OPTIONS['7d']});
                        break;
                    case '30d':
                        expiryDate = new Date(now.getTime() + ${CONFIG.EXPIRY_OPTIONS['30d']});
                        break;
                    case 'custom':
                        expiryDate = document.getElementById('customExpiry').value;
                        break;
                }
            }

            const formData = {
                url: document.getElementById('url').value,
                slug: document.getElementById('slug').value,
                expiry: expiryDate,
                password: document.getElementById('password').value,
                maxVisits: document.getElementById('maxVisits').value,
                token: token
            };
            
            // 发送请求
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            // 处理响应
            if (response.ok) {
                resultDiv.innerHTML = `
                    <div class="p-4 bg-green-50 rounded-lg">
                        <p class="text-green-800 font-medium mb-2">
                            短链接生成成功！
                        </p>
                        <div class="flex items-center gap-2">
                            <input type="text" value="${data.shortened}" readonly
                                class="flex-1 p-2 border border-gray-300 rounded bg-white">
                            <button onclick="copyToClipboard(this, '${data.shortened}')"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                复制
                            </button>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="p-4 bg-red-50 rounded-lg">
                        <p class="text-red-800">${data.error}</p>
                    </div>
                `;
                if (typeof turnstile !== 'undefined') {
                    turnstile.reset();
                }
            }
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="p-4 bg-red-50 rounded-lg">
                    <p class="text-red-800">生成短链接时发生错误，请重试</p>
                </div>
            `;
            if (typeof turnstile !== 'undefined') {
                turnstile.reset();
            }
        } finally {
            // 恢复提交按钮状态
            submitButton.disabled = false;
            submitButton.textContent = '生成短链接';
        }
    });

    // 处理自定义过期时间选择
    document.getElementById('expiry').addEventListener('change', function() {
        const customExpiryInput = document.getElementById('customExpiry');
        if (this.value === 'custom') {
            customExpiryInput.classList.remove('hidden');
        } else {
            customExpiryInput.classList.add('hidden');
        }
    });

    // 复制到剪贴板功能
    function copyToClipboard(button, text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = '已复制!';
            button.classList.add('bg-green-500', 'hover:bg-green-600');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('bg-green-500', 'hover:bg-green-600');
                button.classList.add('bg-blue-500', 'hover:bg-blue-600');
            }, 2000);
        }).catch(() => {
            button.textContent = '复制失败';
            setTimeout(() => {
                button.textContent = '复制';
            }, 2000);
            
  function getPasswordHTML(slug) {
     const turnstileScript = TURNSTILE_SITE_KEY ? 
    '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : 
    '';

  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>访问密码验证</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔒</text></svg>">
    ${turnstileScript}
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <main class="container mx-auto p-6 max-w-md">
        <div class="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90">
            <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">访问密码验证</h1>
            
            <form id="password-form" class="space-y-6">
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        请输入访问密码：
                    </label>
                    <input type="password" id="password" required
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
                </div>

                <!-- Turnstile验证 -->
                <div class="flex justify-center">
                    ${TURNSTILE_SITE_KEY ? 
                        '<div class="cf-turnstile" data-sitekey="' + TURNSTILE_SITE_KEY + '"></div>' : 
                        ''}
                </div>

                <button type="submit" 
                    class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium
                    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-all duration-200">
                    验证并访问
                </button>
            </form>

            <div id="error" class="mt-4 text-center text-red-500"></div>
        </div>
    </main>

    <script>
        document.getElementById('password-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = e.target.querySelector('button');
            const errorDiv = document.getElementById('error');
            const password = document.getElementById('password').value;
            
            submitButton.disabled = true;
            submitButton.textContent = '验证中...';
            errorDiv.textContent = '';
            
            try {
                let token = '';
                try {
                    token = turnstile?.getResponse() || '';
                } catch (error) {
                    console.error('Turnstile error:', error);
                }

                const response = await fetch('/api/verify/${slug}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        password,
                        token 
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.location.href = data.url;
                } else {
                    errorDiv.textContent = data.error || '密码错误';
                    if (typeof turnstile !== 'undefined') {
                        turnstile.reset();
                    }
                }
            } catch (error) {
                errorDiv.textContent = '验证过程发生错误，请重试';
                if (typeof turnstile !== 'undefined') {
                    turnstile.reset();
                }
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = '验证并访问';
            }
        });
    </script>
</body>
</html>`;
}
