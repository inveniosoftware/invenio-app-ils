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

export const http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/api'
      : 'https://127.0.0.1:5000/api',
  headers: {
    Authorization: `bearer ${token}`,
  },
  withCredentials: true,
});
