import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Fetch pending loans reducer', () => {
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
    const pendingLoans = [{ field: '123' }, { field: '456' }];
    const action = {
      type: types.SUCCESS,
      payload: pendingLoans,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: pendingLoans,
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

  it('should change sortBy and reset sortOrder states on change sort by action', () => {
    const action = {
      type: types.CHANGE_SORT_BY,
      payload: 'transaction_date',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      sortBy: 'transaction_date',
      sortOrder: initialState.sortOrder,
    });
  });

  it('should change sortOrder state on change sort order action', () => {
    const action = {
      type: types.CHANGE_SORT_ORDER,
      payload: 'desc',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      sortOrder: 'desc',
    });
  });
});
