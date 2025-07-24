import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Update this with your backend URL
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Receipt related API calls
export const receiptApi = {
    // Upload receipt image
    uploadReceipt: async (imageData) => {
        const formData = new FormData();
        formData.append('file', imageData);
        return api.post('/receipt/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Get receipt analysis results
    getReceiptResults: async (receiptId) => {
        return api.get(`/receipt/${receiptId}`);
    },
};

export default api;
