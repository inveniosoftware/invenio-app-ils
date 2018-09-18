import { SET_LOADING, SET_BOOK_RESULTS } from './types';
import { fetchFeaturedBooks, fetchRecentBooks } from './api';
import { processFeaturedBooks, processRecentBooks } from './selectors';

export const fetchBookResults = () => {
  return async dispatch => {
    dispatch({
      type: SET_LOADING,
      payload: {},
    });

    let featured = await fetchFeaturedBooks();
    featured = processFeaturedBooks(featured.data);
    let recent = await fetchRecentBooks();
    recent = processRecentBooks(recent.data);
    dispatch({
      type: SET_BOOK_RESULTS,
      payload: featured.concat(recent),
    });
  };
};
