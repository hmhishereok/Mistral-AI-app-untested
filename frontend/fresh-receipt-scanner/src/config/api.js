const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // Local backend for development
  ENDPOINTS: {
    PROCESS_RECEIPT: '/api/v1/receipt/upload-receipt/',
    OCR_ONLY: '/api/v1/receipt/ocr-only',
    HEALTH: '/health',
  },
};
export default API_CONFIG;