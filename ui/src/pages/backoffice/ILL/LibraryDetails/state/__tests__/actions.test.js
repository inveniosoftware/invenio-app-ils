import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { library as libraryApi } from '@api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
const mockDelete = jest.fn();

libraryApi.get = mockGet;
libraryApi.delete = mockDelete;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGet.mockClear();
  mockDelete.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Library details actions', () => {
  describe('Fetch library details tests', () => {
    it('should dispatch an action when fetching an library', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchLibraryDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when library fetch succeeds', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchLibraryDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when library fetch fails', done => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchLibraryDetails('456')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('456');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });

  describe('Delete library tests', () => {
    it('should dispatch an action when trigger delete library', async () => {
      const expectedAction = {
        type: types.DELETE_IS_LOADING,
      };

      store.dispatch(actions.deleteLibrary(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when library delete succeeds', async () => {
      mockDelete.mockResolvedValue({ data: { libraryPid: 1 } });
      const expectedAction = {
        type: types.DELETE_SUCCESS,
        payload: { libraryPid: 1 },
      };

      await store.dispatch(actions.deleteLibrary(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when library delete has error', async () => {
      const error = {
        error: { status: 500, message: 'error' },
      };
      mockDelete.mockRejectedValue(error);

      const expectedAction = {
        type: types.DELETE_HAS_ERROR,
        payload: error,
      };

      await store.dispatch(actions.deleteLibrary(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
