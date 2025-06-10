import axios from 'axios';

const axiosInstance = axios.create({
    //baseURL: 'http://127.0.0.1:3658/m1/829899-809617-default'
    //baseURL: 'http://127.0.0.1:63851'
    baseURL: 'http://146.59.34.168:63851/'
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;