import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Fetch current patrons loans reducer', () => {
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
    const currentLoans = [{ field: '123' }, { field: '456' }];
    const action = {
      type: types.SUCCESS,
      payload: currentLoans,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: currentLoans,
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
});
