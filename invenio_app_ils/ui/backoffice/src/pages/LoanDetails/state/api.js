import axios from 'axios';

const loansBaseUrl = 'https://localhost:5000/api/circulation/loans';

// In development create a personal token to be able to perform requests and
// and put it in a .env file under the name `REACT_APP_JWT_TOKEN`
const dev_jwt_token = process.env.REACT_APP_JWT_TOKEN;

const getJwtToken = () => {
  return process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
    ? dev_jwt_token
    : document.getElementsByName('authorized_token')[0].value;
};

const setHeaders = bearer => ({
  headers: {
    Authorization: `bearer ${bearer}`,
    withCredentials: true,
  },
});

export const fetchLoan = loanid => {
  return axios.get(`${loansBaseUrl}/${loanid}`, setHeaders(getJwtToken()));
};

export const postLoan = (url, data) => {
  return axios.post(url, data, setHeaders(getJwtToken()));
};
