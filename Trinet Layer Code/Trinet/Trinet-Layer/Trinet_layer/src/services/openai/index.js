// OpenAI Service Module Exports
export { default as openai } from './openaiClient';
export { getErrorMessage } from './errorHandler';
export { 
  generateVulnerabilityContent,
  generateCompleteVulnerabilitySection,
  generateEnhancedPayloadDescription 
} from './vulnerabilityContentGenerator';