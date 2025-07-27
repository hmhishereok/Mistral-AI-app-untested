// Environment configuration
export const ENV = {
    // AWS EC2 server URL
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://3.25.119.39:8000/api/v1',
    DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true' || false,
};
