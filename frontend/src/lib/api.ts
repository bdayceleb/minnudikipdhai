import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Send cookies with every request
});

// Interceptor to handle automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await axios.post('/api/auth/refresh', {}, { withCredentials: true });

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
