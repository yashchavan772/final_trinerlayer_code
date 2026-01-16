import OpenAI, { 
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError
} from 'openai';

/**
 * Maps OpenAI API error types to user-friendly error messages.
 * @param {Error} error - The error object from OpenAI API.
 * @returns {Object} Error information with isInternal flag and message.
 */
export function getErrorMessage(error) {
  // Handle errors by error class using instanceof
  if (error instanceof AuthenticationError) {
    // 401 - Invalid API key / Authentication related issues
    return { 
      isInternal: true, 
      message: 'Invalid API key or authentication failed. Please check your OpenAI API key.'
    };
  } else if (error instanceof PermissionDeniedError) {
    // 403 - QUOTA Exceed / Authorization related issues
    return { 
      isInternal: true, 
      message: 'Quota exceeded or authorization failed. You may have exceeded your usage limits or do not have access to this resource.'
    };
  } else if (error instanceof RateLimitError) {
    // 429 - Rate Limit Exceeded (usage cap)
    return { 
      isInternal: true, 
      message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.'
    };
  } else if (error instanceof InternalServerError) {
    // 500-504 - Service Outage (provider issues)
    return { 
      isInternal: true, 
      message: 'OpenAI service is currently unavailable. Please try again later.'
    };
  } else if (error instanceof APIConnectionError) {
    // Connection errors (network, DNS, invalid configuration, etc.)
    return { 
      isInternal: true, 
      message: 'Unable to connect to OpenAI service. Please check your API key and internet connection.'
    };
  } else {
    // Default fallback for any other errors
    return { 
      isInternal: false, 
      message: error?.message || 'An unexpected error occurred. Please try again.'
    };
  }
}