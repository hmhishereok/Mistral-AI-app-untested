import { useState } from 'react';

interface ReceiptItem {
    name: string;
    price: number;
}

interface Receipt {
    total: number;
    subtotal?: number;
    tax?: number;
    date: string;
    merchant: string;
    items: ReceiptItem[];
}

// Configuration
const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
    ENDPOINT: '/api/v1/receipt/upload-receipt/',
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
};

export const useReceiptScanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Receipt | null>(null);

    // Helper to convert base64 to Blob
    function base64ToBlob(base64: string, type = 'image/jpeg') {
        try {
            const byteCharacters = atob(base64);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }
            return new Blob(byteArrays, { type });
        } catch (error) {
            console.error('Error converting base64 to blob:', error);
            throw new Error('Failed to process image data');
        }
    }

    const scanReceipt = async (imageUri: string, base64?: string) => {
        console.log('Starting receipt scan with URI:', imageUri);
        setLoading(true);
        setError(null);
        
        try {
            if (!base64) {
                throw new Error('No image data provided');
            }

            const formData = new FormData();
            const blob = base64ToBlob(base64, 'image/jpeg');
            formData.append('file', blob, 'receipt.jpg');

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINT}`;
            console.log('Making request to:', url);

            let lastError: Error | null = null;

            // Retry logic
            for (let attempt = 1; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
                try {
                    console.log(`Attempt ${attempt} of ${API_CONFIG.MAX_RETRIES}`);

                    const response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json',
                        },
                        // Note: timeout might not work in all React Native environments
                    });

                    console.log('Server response status:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Server error response:', errorText);
                        
                        let errorMessage: string;
                        try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.detail || errorJson.message || 'Server error';
                        } catch {
                            errorMessage = errorText || `Server error: ${response.status}`;
                        }

                        if (response.status >= 500 && attempt < API_CONFIG.MAX_RETRIES) {
                            // Server error - retry
                            lastError = new Error(`Server error (${response.status}): ${errorMessage}`);
                            console.log(`Server error, retrying in ${attempt * 1000}ms...`);
                            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                            continue;
                        } else {
                            // Client error or final attempt - don't retry
                            throw new Error(errorMessage);
                        }
                    }

                    const data = await response.json();
                    console.log('Server response data:', data);
                    
                    // Handle new API response format
                    let receiptData: any;
                    if (data.success && data.data) {
                        receiptData = data.data;
                    } else if (data.data) {
                        receiptData = data.data;
                    } else {
                        receiptData = data;
                    }

                    // Validate response structure
                    if (!receiptData || typeof receiptData !== 'object') {
                        throw new Error('Invalid response format from server');
                    }

                    // Ensure required fields
                    const validatedData: Receipt = {
                        merchant: receiptData.merchant || 'Unknown Merchant',
                        date: receiptData.date || 'Unknown Date',
                        total: parseFloat(receiptData.total) || 0,
                        subtotal: receiptData.subtotal ? parseFloat(receiptData.subtotal) : undefined,
                        tax: receiptData.tax ? parseFloat(receiptData.tax) : undefined,
                        items: Array.isArray(receiptData.items) ? receiptData.items.map((item: any) => ({
                            name: item.name || 'Unknown Item',
                            price: parseFloat(item.price) || 0
                        })) : []
                    };

                    console.log('Successfully processed receipt:', validatedData);
                    setResult(validatedData);
                    return;

                } catch (err: any) {
                    lastError = err;
                    
                    if (attempt < API_CONFIG.MAX_RETRIES && (
                        err.name === 'TypeError' || // Network error
                        err.message.includes('fetch') ||
                        err.message.includes('timeout') ||
                        err.message.includes('network')
                    )) {
                        console.log(`Network error, retrying in ${attempt * 1000}ms...`, err.message);
                        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                        continue;
                    }
                    
                    break; // Don't retry for other errors
                }
            }

            throw lastError || new Error('Failed to process receipt after multiple attempts');

        } catch (err: any) {
            console.error('Receipt scanning error:', err);
            setError(err.message || 'An error occurred while scanning the receipt');
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setResult(null);
        setError(null);
    };

    return {
        scanReceipt,
        resetScan,
        loading,
        error,
        result
    };
};
