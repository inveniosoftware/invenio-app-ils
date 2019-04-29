import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { internalLocation as internalLocationApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchInternalLocations = jest.fn();
const mockDelete = jest.fn();
internalLocationApi.list = mockFetchInternalLocations;
internalLocationApi.delete = mockDelete;

const response = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: {},
          links: { self: 'l' },
        },
      ],
    },
  },
};

let store;
beforeEach(() => {
  mockFetchInternalLocations.mockClear();
  mockDelete.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Internal Location actions', () => {
  describe('Fetch internal location details', () => {
    it('should dispatch an action when fetching internal locations', async () => {
      mockFetchInternalLocations.mockResolvedValue(response);
      const expectedAction = {
        type: types.IS_LOADING,
      };

      await store.dispatch(actions.fetchInternalLocations());
      expect(mockFetchInternalLocations).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when internal location fetch succeeds', async () => {
      mockFetchInternalLocations.mockResolvedValue(response);
      const expectedAction = {
        type: types.SUCCESS,
        payload: response.data,
      };

      await store.dispatch(actions.fetchInternalLocations());
      expect(mockFetchInternalLocations).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when internal location fetch fails', async () => {
      mockFetchInternalLocations.mockRejectedValue([500, 'Error']);

      const expectedActions = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchInternalLocations());
      expect(mockFetchInternalLocations).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedActions);
    });
  });

  describe('Delete Internal Location', () => {
    it('should dispatch an action when trigger delete internal location', async () => {
      const expectedAction = {
        type: types.DELETE_IS_LOADING,
      };

      store.dispatch(actions.deleteInternalLocation(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when location delete succeeds', async () => {
      mockDelete.mockResolvedValue({ data: { internalLocationPid: 1 } });
      const expectedAction = {
        type: types.DELETE_SUCCESS,
        payload: { internalLocationPid: 1 },
      };

      await store.dispatch(actions.deleteInternalLocation(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when intenral location delete has error', async () => {
      const error = {
        error: { status: 500, message: 'error' },
      };
      mockDelete.mockRejectedValue(error);

      const expectedAction = {
        type: types.DELETE_HAS_ERROR,
        payload: error,
      };

      await store.dispatch(actions.deleteInternalLocation(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
