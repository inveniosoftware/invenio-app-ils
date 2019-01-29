import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Fetch location details reducer', () => {
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
    const location = {
      hits: { hits: [{ location_pid: '1' }] },
      links: { self: 'link' },
    };

    const expectedData = { hits: [{ location_pid: '1' }], link: 'link' };
    const action = {
      type: types.SUCCESS,
      payload: location,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: expectedData,
      hasError: false,
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: types.HAS_ERROR,
      payload: { response: { status: 404 } },
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      hasError: true,
      data: { response: { status: 404 } },
    });
  });
});
