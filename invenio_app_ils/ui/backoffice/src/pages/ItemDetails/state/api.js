import axios from 'axios';

const itemsBaseUrl = 'https://localhost:5000/api/items';

// In development create a personal token to be able to perform requests and
// and put it in a .env file under the name `REACT_APP_JWT_TOKEN`
const dev_jwt_token = process.env.REACT_APP_JWT_TOKEN;

const getJwtToken = () => {
  return process.env.NODE_ENV === 'development'
    ? dev_jwt_token
    : document.getElementsByName('authorized_token')[0].value;
};

const setHeaders = bearer => ({
  headers: {
    Authorization: `bearer ${bearer}`,
    withCredentials: true,
  },
});

export const fetchItem = itemid => {
  return axios.get(`${itemsBaseUrl}/${itemid}`, setHeaders(getJwtToken()));
};

export const postItem = (url, data) => {
  return axios.post(url, data, setHeaders(getJwtToken()));
};
