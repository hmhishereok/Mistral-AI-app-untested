import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://3.25.119.39:8000/api/v1', // AWS EC2 server
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
