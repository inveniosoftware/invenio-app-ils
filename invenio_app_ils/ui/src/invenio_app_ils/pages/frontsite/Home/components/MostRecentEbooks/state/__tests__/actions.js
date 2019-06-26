import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchMostRecentEbooks = jest.fn();
documentApi.list = mockFetchMostRecentEbooks;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockFetchMostRecentEbooks.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Recently added ebooks actions', () => {
  describe('Fetch most recently added ebooks tests', () => {
    it('should dispatch an action when fetching most recently added ebooks', done => {
      mockFetchMostRecentEbooks.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchMostRecentEbooks()).then(() => {
        expect(mockFetchMostRecentEbooks).toHaveBeenCalledWith(
          'document_types:"BOOK" AND circulation.has_eitems:>0&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most recently added ebooks fetch succeeds', done => {
      mockFetchMostRecentEbooks.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchMostRecentEbooks()).then(() => {
        expect(mockFetchMostRecentEbooks).toHaveBeenCalledWith(
          'document_types:"BOOK" AND circulation.has_eitems:>0&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most recently added ebooks fetch fails', done => {
      mockFetchMostRecentEbooks.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchMostRecentEbooks()).then(() => {
        expect(mockFetchMostRecentEbooks).toHaveBeenCalledWith(
          'document_types:"BOOK" AND circulation.has_eitems:>0&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
