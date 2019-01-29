import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { location as locationApi } from '../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
locationApi.get = mockGet;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGet.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Location details actions', () => {
  describe('Fetch location details tests', () => {
    it('should dispatch an action when fetching locations', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchLocations()).then(() => {
        expect(mockGet).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when location fetch succeeds', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchLocations()).then(() => {
        expect(mockGet).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when location fetch fails', done => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchLocations()).then(() => {
        expect(mockGet).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
