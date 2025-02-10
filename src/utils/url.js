import { CONFIG } from '../config/constants';

export function validateURL(url) {
  try {
    const urlObject = new URL(url);
    if (!urlObject.protocol.match(/^https?:$/)) {
      throw new Error(CONFIG.ERRORS.INVALID_URL);
    }
    return urlObject.toString();
  } catch {
    throw new Error(CONFIG.ERRORS.INVALID_URL);
  }
}

export function validateSlug(slug) {
  if (slug.length < CONFIG.MIN_CUSTOM_SLUG_LENGTH) {
    throw new Error(CONFIG.ERRORS.SLUG_TOO_SHORT);
  }
  
  if (!CONFIG.REGEX.SLUG.test(slug)) {
    throw new Error(CONFIG.ERRORS.INVALID_SLUG);
  }
}
