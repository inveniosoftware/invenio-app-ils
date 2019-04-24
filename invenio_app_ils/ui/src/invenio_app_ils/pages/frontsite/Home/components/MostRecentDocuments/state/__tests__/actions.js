import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchRecentlyAddedDocs = jest.fn();
documentApi.list = mockFetchRecentlyAddedDocs;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockFetchRecentlyAddedDocs.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Recently added documents actions', () => {
  describe('Fetch most recently added documents tests', () => {
    it('should dispatch an action when fetching most recently added documents', done => {
      mockFetchRecentlyAddedDocs.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchMostRecentDocuments()).then(() => {
        expect(mockFetchRecentlyAddedDocs).toHaveBeenCalledWith(
          '&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most recently added documents fetch succeeds', done => {
      mockFetchRecentlyAddedDocs.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchMostRecentDocuments()).then(() => {
        expect(mockFetchRecentlyAddedDocs).toHaveBeenCalledWith(
          '&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most recently added documents fetch fails', done => {
      mockFetchRecentlyAddedDocs.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchMostRecentDocuments()).then(() => {
        expect(mockFetchRecentlyAddedDocs).toHaveBeenCalledWith(
          '&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
