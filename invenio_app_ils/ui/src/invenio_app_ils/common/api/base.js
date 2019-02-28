import axios from 'axios';
import { sessionManager } from '../../authentication/services';

const token = sessionManager.token ? sessionManager.token.value : '';

const apiConfig = {
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'https://127.0.0.1:5000/api',
  headers: {
    Authorization: `bearer ${token}`,
  },
  withCredentials: true,
};

const http = axios.create(apiConfig);

export { http, apiConfig };
