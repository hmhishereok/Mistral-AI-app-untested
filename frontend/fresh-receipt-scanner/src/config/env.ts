// Environment configuration
export const ENV = {
    // Use your computer's IP address here instead of localhost for mobile testing
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true' || false,
};
