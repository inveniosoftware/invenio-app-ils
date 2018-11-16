import axios from 'axios';

// In development create a personal token to be able to perform requests and
// and put it in a .env file under the name `REACT_APP_JWT_TOKEN`
const getProductionToken = () => {
  const res = document.getElementsByName('authorized_token');
  if (res.length > 0 && res[0].hasOwnProperty('value')) {
    return res[0].value;
  }
  return '';
};

const token =
  process.env.NODE_ENV === 'production'
    ? getProductionToken()
    : process.env.REACT_APP_JWT_TOKEN;

export const apiConfig = {
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'https://127.0.0.1:5000/api',
  headers: {
    Authorization: `bearer ${token}`,
  },
  withCredentials: true,
};

export const http = axios.create(apiConfig);

const toIsoString = date => {
  const tzo = -date.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = num => {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  };
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  );
};

export const formatDate = date => {
  return toIsoString(date);
};
