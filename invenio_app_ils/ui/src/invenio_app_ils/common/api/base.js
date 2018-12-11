import axios from 'axios';

const getTokenFromDOM = () => {
  const element = document.getElementsByName('authorized_token');
  if (element.length > 0 && element[0].hasOwnProperty('value')) {
    return element[0].value;
  }
  return '';
};

const token =
  process.env.NODE_ENV === 'production'
    ? getTokenFromDOM()
    : process.env.REACT_APP_JWT_TOKEN;

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
