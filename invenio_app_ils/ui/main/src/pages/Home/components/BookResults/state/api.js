import axios from 'axios';

const booksUrl = 'http://127.0.0.1:3001/books';

export const fetchFeaturedBooks = () => {
  return axios.get(`${booksUrl}/featured`);
};

export const fetchRecentBooks = () => {
  return axios.get(`${booksUrl}/recent`);
};
