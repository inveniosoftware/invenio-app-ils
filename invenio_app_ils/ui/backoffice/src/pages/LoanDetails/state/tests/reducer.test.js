import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('loan details reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('returns the loan fetch details loading state', () => {
    let action = {
      type: types.SET_LOAN_FETCH_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      fetchLoading: true,
    });
  });

  it('returns the loan fetch details success state', () => {
    let action = {
      type: types.LOAN_FETCH_DETAILS_SUCCESS,
      payload: {},
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      fetchLoading: false,
      data: {},
    });
  });

  it('returns the loan fetch details error state', () => {
    let action = {
      type: types.SET_LOAN_ACTION_ERROR,
      payload: 'Error',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionLoading: false,
      fetchLoading: false,
      loanActionError: true,
      error: 'Error',
    });
  });

  it('returns the loan transition action loading state', () => {
    let action = {
      type: types.SET_LOAN_ACTION_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionLoading: true,
    });
  });
});
