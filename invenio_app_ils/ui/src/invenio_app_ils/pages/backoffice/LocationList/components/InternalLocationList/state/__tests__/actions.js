import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { internalLocation as locationApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchInternalLocations = jest.fn();
locationApi.list = mockFetchInternalLocations;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockFetchInternalLocations.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Internal Location details actions', () => {
  describe('Fetch internal location details tests', () => {
    it('should dispatch an action when fetching internal locations', done => {
      mockFetchInternalLocations.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchInternalLocations()).then(() => {
        expect(mockFetchInternalLocations).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when internal location fetch succeeds', done => {
      mockFetchInternalLocations.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchInternalLocations()).then(() => {
        expect(mockFetchInternalLocations).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when internal location fetch fails', done => {
      mockFetchInternalLocations.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchInternalLocations()).then(() => {
        expect(mockFetchInternalLocations).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
