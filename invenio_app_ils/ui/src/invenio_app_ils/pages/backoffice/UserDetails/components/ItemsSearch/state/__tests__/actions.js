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
      hits: [{ id: '123', updated: '2018-01-01T11:05:00+01:00', metadata: {} }],
    },
  },
};

const mockFetchItems = jest.fn();
itemApi.list = mockFetchItems;

let store;
beforeEach(() => {
  mockFetchItems.mockClear();

  store = mockStore({ documentItems: initialState });
  store.clearActions();
});

describe('Item search by barcode tests', () => {
  describe('Fetch items by barcode tests', () => {
    it('should dispatch a loading action when fetching items', done => {
      mockFetchItems.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchItems('123')).then(() => {
        expect(mockFetchItems).toHaveBeenCalledWith('barcode:123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a success action when items fetch succeeds', done => {
      mockFetchItems.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      store.dispatch(actions.fetchItems('123')).then(() => {
        expect(mockFetchItems).toHaveBeenCalledWith('barcode:123');
        const actions = store.getActions();
        expect(JSON.stringify(actions[1])).toEqual(
          JSON.stringify(expectedAction)
        );
        done();
      });
    });

    it('should dispatch an error action when items fetch fails', done => {
      mockFetchItems.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store.dispatch(actions.fetchItems('123')).then(() => {
        expect(mockFetchItems).toHaveBeenCalledWith('barcode:123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a query string update action', done => {
      const expectedAction = {
        type: types.QUERY_STRING_UPDATE,
        queryString: 'pppp',
      };

      store.dispatch(actions.updateQueryString('pppp'));
      const updatedActions = store.getActions();
      expect(updatedActions[0]).toEqual(expectedAction);
      done();
    });

    it('should dispatch clear query action', done => {
      const expectedAction = {
        type: types.CLEAR_SEARCH,
      };

      store.dispatch(actions.clearResults());
      const updatedActions = store.getActions();
      expect(updatedActions[0]).toEqual(expectedAction);
      done();
    });
  });
});
