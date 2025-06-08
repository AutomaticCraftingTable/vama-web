import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3658/m1/829899-809617-default',
});
const axiosNewInstance = axios.create({
    baseURL: 'http://127.0.0.1:63851',
});
export { axiosInstance, axiosNewInstance };
export default axiosInstance;