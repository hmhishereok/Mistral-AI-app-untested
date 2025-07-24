import axios from 'axios';

import { ENV } from '../config/env';

// Create axios instance with base URL
const api = axios.create({
    baseURL: ENV.API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Receipt related API calls
export const receiptApi = {
    // Upload receipt image
    uploadReceipt: async (imageUri: string) => {
        const formData = new FormData();
        
        // Create file object from URI
        const filename = imageUri.split('/').pop() || 'receipt.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('file', {
            uri: imageUri,
            name: filename,
            type,
        } as any);

        return api.post('/receipt/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Get receipt analysis results
    getReceiptResults: async (receiptId: string) => {
        return api.get(`/receipt/${receiptId}`);
    },
};

// Error interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
