import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchMostRecentBooks = jest.fn();
documentApi.list = mockFetchMostRecentBooks;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockFetchMostRecentBooks.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Recently added books actions', () => {
  describe('Fetch most recently added books tests', () => {
    it('should dispatch an action when fetching most recently added books', done => {
      mockFetchMostRecentBooks.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchMostRecentBooks()).then(() => {
        expect(mockFetchMostRecentBooks).toHaveBeenCalledWith(
          'document_types:"BOOK"&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most recently added books fetch succeeds', done => {
      mockFetchMostRecentBooks.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchMostRecentBooks()).then(() => {
        expect(mockFetchMostRecentBooks).toHaveBeenCalledWith(
          'document_types:"BOOK"&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most recently added books fetch fails', done => {
      mockFetchMostRecentBooks.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchMostRecentBooks()).then(() => {
        expect(mockFetchMostRecentBooks).toHaveBeenCalledWith(
          'document_types:"BOOK"&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
