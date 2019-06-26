import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchMostLoanedBooks = jest.fn();
documentApi.list = mockFetchMostLoanedBooks;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockFetchMostLoanedBooks.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Most loaned books actions', () => {
  describe('Fetch most loaned books tests', () => {
    it('should dispatch an action when fetching most loaned books', done => {
      mockFetchMostLoanedBooks.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchMostLoanedBooks()).then(() => {
        expect(mockFetchMostLoanedBooks).toHaveBeenCalledWith(
          'circulation.active_loans:>0 AND document_types:"BOOK"&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most loaned books fetch succeeds', done => {
      mockFetchMostLoanedBooks.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchMostLoanedBooks()).then(() => {
        expect(mockFetchMostLoanedBooks).toHaveBeenCalledWith(
          'circulation.active_loans:>0 AND document_types:"BOOK"&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most loaned books fetch fails', done => {
      mockFetchMostLoanedBooks.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchMostLoanedBooks()).then(() => {
        expect(mockFetchMostLoanedBooks).toHaveBeenCalledWith(
          'circulation.active_loans:>0 AND document_types:"BOOK"&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
