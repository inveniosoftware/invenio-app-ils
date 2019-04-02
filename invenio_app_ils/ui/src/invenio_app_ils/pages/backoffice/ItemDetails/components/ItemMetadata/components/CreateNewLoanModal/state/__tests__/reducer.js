import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Create new loan request for item reducer', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change loading state on loading action', () => {
    const action = {
      type: types.IS_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      newLoanCreate: { isLoading: true },
    });
  });

  it('should change data state on success action', () => {
    const loan = { item_pid: '1232423' };
    const action = {
      type: types.SUCCESS,
      payload: loan,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      newLoanCreate: {
        isLoading: false,
        data: loan,
        error: {},
        hasError: false,
      },
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: types.HAS_ERROR,
      payload: 'Error',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      newLoanCreate: { isLoading: false, error: 'Error', hasError: true },
    });
  });
});
