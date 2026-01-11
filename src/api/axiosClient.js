import axios from 'axios';


const axiosClient = axios.create({

baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
headers: { 'Content-Type': 'application/json' },
timeout: 10000,
});


axiosClient.interceptors.request.use((config) => {
    console.log("axiosclient called");
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});


export default axiosClient;