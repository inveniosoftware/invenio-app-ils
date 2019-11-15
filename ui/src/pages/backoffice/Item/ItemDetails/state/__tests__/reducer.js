import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Fetch item details reducer', () => {
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
    const item = { barcode: '1232423' };
    const action = {
      type: types.SUCCESS,
      payload: item,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: item,
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

describe('Delete item reducer', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change loading state on item delete', () => {
    const action = {
      type: types.DELETE_IS_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should keep loading to re-fetch items on deleted item success', () => {
    const action = {
      type: types.DELETE_SUCCESS,
      payload: { itemPid: 1 },
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should change error state on delete item error', () => {
    const action = {
      type: types.DELETE_HAS_ERROR,
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
