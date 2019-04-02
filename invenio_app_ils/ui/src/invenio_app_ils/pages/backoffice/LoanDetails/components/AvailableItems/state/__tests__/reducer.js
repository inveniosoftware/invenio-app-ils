import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Fetch available items reducer', () => {
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
    const items = [
      {
        id: 987,
        metadata: {
          barcode: '9865745223',
          document_pid: 1342,
          document: {
            document_pid: 1342,
          },
          status: 'LOANABLE',
          internal_location_pid: 1,
          internal_location: {
            name: 'A library',
            internal_location_pid: 1,
          },
        },
      },
      {
        id: 988,
        metadata: {
          barcode: '9865745224',
          document_pid: 1342,
          document: {
            document_pid: 1342,
          },
          status: 'LOANABLE',
          internal_location_pid: 1,
          internal_location: {
            name: 'A library',
            internal_location_pid: 1,
          },
        },
      },
    ];
    const action = {
      type: types.SUCCESS,
      payload: items,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: items,
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
