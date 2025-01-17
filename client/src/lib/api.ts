import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // this ensures cookies are sent with requests
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // handle edge case - token has expired or is invalid
        if (error.response.status === 401) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
