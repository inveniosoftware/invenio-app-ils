import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { item as itemApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [{ id: 123, updated: '2018-01-01T11:05:00+01:00', metadata: {} }],
    },
  },
};

const mockFetchDocumentItems = jest.fn();
itemApi.list = mockFetchDocumentItems;

let store;
beforeEach(() => {
  mockFetchDocumentItems.mockClear();

  store = mockStore({ documentItems: initialState });
  store.clearActions();
});

describe('Document Item tests', () => {
  describe('Fetch document item tests', () => {
    it('should dispatch a loading action when fetching items', async () => {
      mockFetchDocumentItems.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchDocumentItems('123'));
      expect(mockFetchDocumentItems).toHaveBeenCalledWith('document_pid:123');
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when items fetch succeeds', async () => {
      mockFetchDocumentItems.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      await store.dispatch(actions.fetchDocumentItems('123'));
      expect(mockFetchDocumentItems).toHaveBeenCalledWith('document_pid:123');
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when items fetch fails', async () => {
      mockFetchDocumentItems.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchDocumentItems('123'));
      expect(mockFetchDocumentItems).toHaveBeenCalledWith('document_pid:123');
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
