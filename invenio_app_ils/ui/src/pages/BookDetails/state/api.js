import axios from 'axios';

const booksUrl = 'http://localhost:3001/books';

export const fetchBook = recid => {
  return axios.get(`${booksUrl}/${recid}`);
};

export const fetchBookRelated = recid => {
  // TODO: should return related books base on `recid`
  return axios.get(`${booksUrl}/featured`);
};
