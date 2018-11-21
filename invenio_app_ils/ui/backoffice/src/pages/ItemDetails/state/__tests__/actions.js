import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { item as itemApi } from 'common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGetRecord = jest.fn();
itemApi.getRecord = mockGetRecord;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGetRecord.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Item details actions', () => {
  describe('Fetch item details tests', () => {
    it('should dispatch an action when fetching an item', done => {
      mockGetRecord.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchItemDetails('123')).then(() => {
        expect(mockGetRecord).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when item fetch succeeds', done => {
      mockGetRecord.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchItemDetails('123')).then(() => {
        expect(mockGetRecord).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when item fetch fails', done => {
      mockGetRecord.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchItemDetails('456')).then(() => {
        expect(mockGetRecord).toHaveBeenCalledWith('456');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
