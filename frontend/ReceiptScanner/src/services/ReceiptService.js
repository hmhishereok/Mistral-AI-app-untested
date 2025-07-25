import API_CONFIG from '../config/api';

class ReceiptService {
  static async processReceipt(imageUri) {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    formData.append('file', { uri: imageUri, name: filename || 'receipt.jpg', type });
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROCESS_RECEIPT}`,
      { method: 'POST', body: formData }
    );
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  }
}
export default ReceiptService;