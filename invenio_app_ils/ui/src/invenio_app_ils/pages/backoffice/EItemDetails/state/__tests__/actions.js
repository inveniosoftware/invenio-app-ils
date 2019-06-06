import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { eitem as eitemApi } from '../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
const mockDelete = jest.fn();
eitemApi.get = mockGet;
eitemApi.delete = mockDelete;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGet.mockClear();
  mockDelete.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('EItem details actions', () => {
  describe('Fetch eitem details tests', () => {
    it('should dispatch an action when fetching an eitem', async () => {
      mockGet.mockResolvedValue(response);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchEItemDetails('123'));
      expect(mockGet).toHaveBeenCalledWith('123');
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when eitem fetch succeeds', async () => {
      mockGet.mockResolvedValue(response);

      const expectedAction = {
        type: types.SUCCESS,
        payload: expectedPayload,
      };

      await store.dispatch(actions.fetchEItemDetails('123'));
      expect(mockGet).toHaveBeenCalledWith('123');
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when eitem fetch fails', async () => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchEItemDetails('456'));
      expect(mockGet).toHaveBeenCalledWith('456');
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });

  describe('Delete EItem tests', () => {
    it('should dispatch an action when trigger delete eitem', async () => {
      const expectedAction = {
        type: types.DELETE_IS_LOADING,
      };

      store.dispatch(actions.deleteEItem(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when eitem delete succeeds', async () => {
      mockDelete.mockResolvedValue({ data: { eitemPid: 1 } });
      const expectedAction = {
        type: types.DELETE_SUCCESS,
        payload: { eitemPid: 1 },
      };

      await store.dispatch(actions.deleteEItem(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when eitem delete has error', async () => {
      const error = {
        error: { status: 500, message: 'error' },
      };
      mockDelete.mockRejectedValue(error);

      const expectedAction = {
        type: types.DELETE_HAS_ERROR,
        payload: error,
      };

      await store.dispatch(actions.deleteEItem(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
