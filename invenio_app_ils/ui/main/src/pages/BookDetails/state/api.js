import axios from 'axios';

const booksUrl = 'http://127.0.0.1:3001/books';

export const fetchBook = recid => {
  return axios.get(`${booksUrl}/${recid}`);
};

export const fetchBookRelated = recid => {
  // TODO: should return related books base on `recid`
  return axios.get(`${booksUrl}/featured`);
};
