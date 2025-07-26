// API Configuration
const API_CONFIG = {
  // Use environment variable or fallback to localhost
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  
  ENDPOINTS: {
    PROCESS_RECEIPT: '/api/v1/receipt/upload-receipt/',
    HEALTH: '/health',
    RECEIPT_HEALTH: '/api/v1/receipt/health',
  },
  
  // Request configuration
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

export default API_CONFIG;