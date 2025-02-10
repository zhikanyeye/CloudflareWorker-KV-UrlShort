export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function sanitizeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function verifyPassword(inputPassword, storedPassword) {
  if (!inputPassword || !storedPassword) return false;
  
  let result = true;
  const inputLength = inputPassword.length;
  const storedLength = storedPassword.length;
  
  for (let i = 0; i < Math.max(inputLength, storedLength); i++) {
    if (i >= inputLength || i >= storedLength || inputPassword[i] !== storedPassword[i]) {
      result = false;
    }
  }
  
  return result;
}
