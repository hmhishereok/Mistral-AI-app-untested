const API_CONFIG = {
  BASE_URL: 'http://3.25.119.39:8000', // AWS EC2 server
  ENDPOINTS: {
    PROCESS_RECEIPT: '/api/v1/receipt/upload-receipt/',
    OCR_ONLY: '/api/v1/receipt/ocr-only',
    HEALTH: '/health',
  },
};

export default API_CONFIG;