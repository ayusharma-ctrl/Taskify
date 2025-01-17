import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // this ensures cookies are sent with requests
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // handle edge case - token has expired or is invalid
        if (error.response.status === 401) {
            localStorage.removeItem('persist:root');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
