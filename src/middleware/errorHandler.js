/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Error handler middleware
 * @param {Error} error - The error object
 * @returns {Response} - Response object with appropriate error details
 */
export function handleError(error) {
  console.error('Error:', error);

  // If it's our custom AppError, use its status and message
  if (error instanceof AppError) {
    return new Response(error.message, {
      status: error.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  // Handle specific error types
  if (error instanceof URIError) {
    return new Response(JSON.stringify({
      error: 'Invalid URL format'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  if (error instanceof TypeError) {
    return new Response(JSON.stringify({
      error: 'Invalid input type'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  // Default error response for unhandled errors
  return new Response(JSON.stringify({
    error: 'Internal Server Error'
  }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}

/**
 * Create common error responses
 */
export const ErrorResponses = {
  invalidUrl: () => new AppError(CONFIG.ERRORS.INVALID_URL, 400, 'INVALID_URL'),
  invalidSlug: () => new AppError(CONFIG.ERRORS.INVALID_SLUG, 400, 'INVALID_SLUG'),
  slugTooShort: () => new AppError(CONFIG.ERRORS.SLUG_TOO_SHORT, 400, 'SLUG_TOO_SHORT'),
  expired: () => new AppError(CONFIG.ERRORS.EXPIRED, 410, 'LINK_EXPIRED'),
  notFound: () => new AppError(CONFIG.ERRORS.NOT_FOUND, 404, 'NOT_FOUND'),
  visitsExceeded: () => new AppError(CONFIG.ERRORS.VISITS_EXCEEDED, 403, 'VISITS_EXCEEDED'),
  rateLimit: () => new AppError(CONFIG.ERRORS.RATE_LIMIT, 429, 'RATE_LIMIT_EXCEEDED'),
  invalidPassword: () => new AppError(CONFIG.ERRORS.INVALID_PASSWORD, 401, 'INVALID_PASSWORD'),
  turnstileRequired: () => new AppError(CONFIG.ERRORS.TURNSTILE_REQUIRED, 400, 'TURNSTILE_REQUIRED')
};

/**
 * Helper function to safely parse JSON
 * @param {string} str - JSON string to parse
 * @returns {Object|null} - Parsed object or null if invalid
 */
export function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    throw new AppError('Invalid JSON format', 400, 'INVALID_JSON');
  }
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @throws {AppError} - If URL is invalid
 */
export function validateUrl(url) {
  if (!CONFIG.REGEX.URL.test(url)) {
    throw ErrorResponses.invalidUrl();
  }
}

/**
 * Validate custom slug format
 * @param {string} slug - Custom slug to validate
 * @throws {AppError} - If slug is invalid
 */
export function validateSlug(slug) {
  if (slug) {
    if (slug.length < CONFIG.MIN_CUSTOM_SLUG_LENGTH) {
      throw ErrorResponses.slugTooShort();
    }
    if (!CONFIG.REGEX.SLUG.test(slug)) {
      throw ErrorResponses.invalidSlug();
    }
  }
}
