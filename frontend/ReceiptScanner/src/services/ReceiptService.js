import API_CONFIG from '../config/api';

class ReceiptService {
  static async processReceipt(imageUri) {
    if (!imageUri) {
      throw new Error('Image URI is required');
    }

    // Validate file size if possible
    try {
      const response = await fetch(imageUri, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > API_CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
    } catch (sizeError) {
      console.warn('Could not check file size:', sizeError.message);
    }

    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Validate file type
    if (!API_CONFIG.ALLOWED_TYPES.includes(type)) {
      throw new Error(`File type ${type} not supported. Allowed types: ${API_CONFIG.ALLOWED_TYPES.join(', ')}`);
    }

    formData.append('file', {
      uri: imageUri,
      name: filename || 'receipt.jpg',
      type: type
    });

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROCESS_RECEIPT}`;
    
    // Retry logic
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt} - Sending request to: ${url}`);
        
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
          timeout: API_CONFIG.TIMEOUT,
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage;
          
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.detail || errorJson.message || 'Server error';
          } catch {
            errorMessage = errorText || `Server error: ${response.status}`;
          }

          if (response.status >= 500) {
            // Server error - might be worth retrying
            lastError = new Error(`Server error (${response.status}): ${errorMessage}`);
            if (attempt < API_CONFIG.MAX_RETRIES) {
              console.log(`Server error, retrying in ${attempt * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
              continue;
            }
          } else {
            // Client error - don't retry
            throw new Error(errorMessage);
          }
        }

        const result = await response.json();
        
        // Handle the new API response format
        if (result.success && result.data) {
          return {
            ...result.data,
            metadata: result.metadata
          };
        } else if (result.data) {
          return result.data;
        } else {
          // Fallback for old format
          return result;
        }

      } catch (error) {
        lastError = error;
        
        if (attempt < API_CONFIG.MAX_RETRIES && (
          error.name === 'TypeError' || // Network error
          error.message.includes('timeout') ||
          error.message.includes('fetch')
        )) {
          console.log(`Network error, retrying in ${attempt * 1000}ms...`, error.message);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        
        break; // Don't retry for other types of errors
      }
    }

    throw lastError || new Error('Failed to process receipt after multiple attempts');
  }

  static async checkHealth() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`API health check failed: ${error.message}`);
    }
  }
}

export default ReceiptService;