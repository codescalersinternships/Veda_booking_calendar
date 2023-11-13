import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('vedaAccessToken');
  if (accessToken) {
    config.headers = { ...config.headers, Authorization: accessToken };
  }
  return config;
});

export default http;
