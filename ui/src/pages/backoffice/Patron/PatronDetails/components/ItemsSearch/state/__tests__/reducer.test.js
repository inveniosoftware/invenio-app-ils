import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Fetch Document Item reducer', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change loading state on loading action', () => {
    const action = {
      type: types.IS_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should change data state on success action', () => {
    const items = [{ field: '123' }, { field: '456' }];
    const action = {
      type: types.SUCCESS,
      payload: items,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: items,
      error: {},
      hasError: false,
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: types.HAS_ERROR,
      payload: 'Error',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Error',
      hasError: true,
    });
  });

  it('should update query string on string update', () => {
    const action = {
      type: types.QUERY_STRING_UPDATE,
      queryString: 'ppppp',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      itemCheckoutQueryString: 'ppppp',
    });
  });

  it('should erase query string when clear ', () => {
    const action = {
      type: types.CLEAR_SEARCH,
      queryString: 'ppppp',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      itemCheckoutQueryString: '',
    });
  });
});
