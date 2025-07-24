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

    const scanReceipt = async (imageUri: string) => {
        setLoading(true);
        setError(null);
        
        try {
            // Create a FormData object to send the image
            const formData = new FormData();
            formData.append('receipt', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'receipt.jpg',
            });

            // Send the image to the backend
            const response = await fetch('http://localhost:8000/api/v1/receipt/upload-receipt/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}. Please try again.`);
            }

            const data = await response.json();
            if (!data || !data.merchant) {
                throw new Error('Could not process receipt. Please try again with a clearer image.');
            }
            setResult(data);
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
