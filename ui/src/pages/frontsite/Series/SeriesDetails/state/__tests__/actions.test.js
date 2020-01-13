import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { series as seriesApi } from '@api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
seriesApi.get = mockGet;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGet.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Series details actions', () => {
  describe('Fetch series details tests', () => {
    it('should dispatch an action when fetching a series', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchSeriesDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when series fetch succeeds', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchSeriesDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when series fetch fails', done => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchSeriesDetails('456')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('456');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
