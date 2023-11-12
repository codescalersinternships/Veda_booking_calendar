import axios from 'axios';
import { AuthenticationApiProvider } from './auth';

axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use(config => {
  if (AuthenticationApiProvider.isAuthenticated()) {
    config.headers = { ...config.headers, Authorization: `Bearer ${localStorage.getItem('accesstoken')}` };
  }
  return config;
});

export default axios;
