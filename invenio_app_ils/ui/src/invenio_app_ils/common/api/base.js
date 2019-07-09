import axios from 'axios';

const apiConfig = {
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'https://127.0.0.1:5000/api',
  withCredentials: true,
};

const http = axios.create(apiConfig);

export { http, apiConfig };
