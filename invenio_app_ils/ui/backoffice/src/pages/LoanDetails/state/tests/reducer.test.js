import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('LoanDetailsContainer reducer', () => {
  it('should render LoanDetailsContainer', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should check api loading state', () => {
    let action = {
      type: types.SET_LOAN_FETCH_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should check loading success', () => {
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

  it('should check loading error', () => {
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

  it('should check action loading state', () => {
    let action = {
      type: types.SET_LOAN_ACTION_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      actionLoading: true,
    });
  });
});
