import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
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
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user (will be handled by store/components)
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
