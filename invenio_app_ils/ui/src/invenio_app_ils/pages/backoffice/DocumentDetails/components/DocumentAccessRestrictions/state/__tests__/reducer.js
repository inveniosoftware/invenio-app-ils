import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Document access restrictions reducer', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change loading state on loading action', () => {
    const action = {
      type: types.SET_RESTRICTIONS_IS_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should change data state on success action', () => {
    const document = { id: '123' };
    const action = {
      type: types.SET_RESTRICTIONS_SUCCESS,
      payload: document,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: document,
      hasError: false,
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: types.SET_RESTRICTIONS_HAS_ERROR,
      payload: { response: { status: 404 } },
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      hasError: true,
      error: { response: { status: 404 } },
    });
  });
});
