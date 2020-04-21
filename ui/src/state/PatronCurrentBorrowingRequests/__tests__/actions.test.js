import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { illBorrowingRequest as borrowingRequestApi } from '@api';

jest.mock('@config/invenioConfig');
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: { pid: '123' },
        },
      ],
    },
  },
};

const mockFetchUserLoan = jest.fn();
borrowingRequestApi.list = mockFetchUserLoan;

let store;
beforeEach(() => {
  mockFetchUserLoan.mockClear();

  store = mockStore({ patronCurrentBorrowingRequests: initialState });
  store.clearActions();
});

describe('Patron borrowing requests tests', () => {
  describe('fetch Patron borrowing requests tests', () => {
    it('should dispatch a loading action when fetching patron borrowing requests', done => {
      mockFetchUserLoan.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store
        .dispatch(actions.fetchPatronCurrentBorrowingRequests(2))
        .then(() => {
          expect(mockFetchUserLoan).toHaveBeenCalledWith(
            '(patron_pid:2 AND status:(REQUESTED OR PENDING))&page=1'
          );
          const actions = store.getActions();
          expect(actions[0]).toEqual(expectedAction);
          done();
        });
    });

    it('should dispatch a success action when patron borrowing requests fetch succeeds', done => {
      mockFetchUserLoan.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      store
        .dispatch(actions.fetchPatronCurrentBorrowingRequests(2))
        .then(() => {
          expect(mockFetchUserLoan).toHaveBeenCalledWith(
            '(patron_pid:2 AND status:(REQUESTED OR PENDING))&page=1'
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedAction);
          done();
        });
    });

    it('should dispatch an error action when patron borrowing requests fetch fails', done => {
      mockFetchUserLoan.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store
        .dispatch(actions.fetchPatronCurrentBorrowingRequests(2))
        .then(() => {
          expect(mockFetchUserLoan).toHaveBeenCalledWith(
            '(patron_pid:2 AND status:(REQUESTED OR PENDING))&page=1'
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedAction);
          done();
        });
    });
  });
});
