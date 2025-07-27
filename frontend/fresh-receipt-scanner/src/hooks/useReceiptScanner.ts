import { useState } from 'react';

interface ReceiptItem {
    name: string;
    price: string;
}

interface Receipt {
    total: string;
    subtotal?: string;
    tax?: string;
    date: string;
    merchant: string;
    items: ReceiptItem[];
}

export const useReceiptScanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Receipt | null>(null);

    // Helper to convert base64 to Blob
    function base64ToBlob(base64: string, type = 'image/jpeg') {
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
    }

    const scanReceipt = async (imageUri: string, base64?: string) => {
        console.log('Starting receipt scan with URI:', imageUri);
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            if (base64) {
                const blob = base64ToBlob(base64, 'image/jpeg');
                formData.append('file', blob, 'receipt.jpg');
            } else {
                throw new Error('No base64 image data provided for web upload.');
            }
            // Use AWS EC2 server URL
            const response = await fetch('http://3.25.119.39:8000/api/v1/receipt/upload-receipt/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('Server response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server error: ${response.status}. ${errorText}`);
            }

            const data = await response.json();
            console.log('Server response data:', data);
            
            if (!data || !data.data || !data.data.merchant) {
                console.error('Invalid response data:', data);
                throw new Error('Could not process receipt. Please try again with a clearer image.');
            }
            setResult(data.data);
        } catch (err: any) {
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
