import axios from 'axios';

const booksUrl = 'http://localhost:3001/books';

export const fetchFeaturedBooks = () => {
  return axios.get(`${booksUrl}/featured`);
};

export const fetchRecentBooks = () => {
  return axios.get(`${booksUrl}/recent`);
};
