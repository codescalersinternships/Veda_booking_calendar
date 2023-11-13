import axios from 'axios';
import { AuthenticationApiProvider } from './auth';

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(config => {
  console.log('Here...');

  const accessToken = localStorage.getItem('vedaAccessToken');
  console.log('accessToken', accessToken);
  if (accessToken) {
    config.headers = { ...config.headers, Authorization: accessToken };
  }
  return config;
});

export default http;
