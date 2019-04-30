import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Create new loan for item reducer', () => {
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
    const response = {
      created: '2019',
      id: 123,
      updated: '2019',
      links: {},
      metadata: {},
    };
    const action = {
      type: types.SUCCESS,
      payload: response,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      newLoanCreate: {
        isLoading: false,
        data: response,
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
