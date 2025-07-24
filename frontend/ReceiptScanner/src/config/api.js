const API_CONFIG = {
  BASE_URL: 'http://192.168.50.230:8000', // Change to your backend IP
  ENDPOINTS: {
    PROCESS_RECEIPT: '/api/v1/receipt/upload-receipt/',
    OCR_ONLY: '/api/v1/receipt/ocr-only',
    HEALTH: '/health',
  },
};
export default API_CONFIG;