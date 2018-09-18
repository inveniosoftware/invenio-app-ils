import { SET_LOADING, SET_BOOK_DETAILS } from './types';
import { fetchBook, fetchBookRelated } from './api';
import { processBookRelated } from './selectors';

export const fetchBookDetails = recid => {
  return async dispatch => {
    dispatch({
      type: SET_LOADING,
      payload: {},
    });

    let related = await fetchBookRelated(recid);
    related = processBookRelated(related.data);

    let details = await fetchBook(recid);
    details = details.data;
    details['related'] = related;
    dispatch({
      type: SET_BOOK_DETAILS,
      payload: details,
    });
  };
};
