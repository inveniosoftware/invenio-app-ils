import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('LoanDetailsContainer reducer', () => {
  it('LoanDetailsContainer initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('LoanDetailsContainer loading state', () => {
    let action = {
      type: types.SET_LOAN_FETCH_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('LoanDetailsContainer fetch success', () => {
    let action = {
      type: types.LOAN_FETCH_DETAILS_SUCCESS,
      payload: {},
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: {},
    });
  });

  it('LoanDetailsContainer fetch error', () => {
    let action = {
      type: types.SET_LOAN_ACTION_ERROR,
      payload: 'Error',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionLoading: false,
      isLoading: false,
      loanActionError: true,
      error: 'Error',
    });
  });

  it('LoanDetailsContainer action loading', () => {
    let action = {
      type: types.SET_LOAN_ACTION_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionLoading: true,
    });
  });
});
