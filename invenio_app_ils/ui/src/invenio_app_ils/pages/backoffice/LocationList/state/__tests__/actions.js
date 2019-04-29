import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { location as locationApi } from '../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockList = jest.fn();
const mockDelete = jest.fn();
locationApi.list = mockList;
locationApi.delete = mockDelete;

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
  mockList.mockClear();
  mockDelete.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Location actions', () => {
  describe('Fetch location details tests', () => {
    it('should dispatch an action when fetching locations', async () => {
      mockList.mockResolvedValue(response);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchLocations());
      expect(mockList).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when location fetch succeeds', async () => {
      mockList.mockResolvedValue(response);

      const expectedAction = {
        type: types.SUCCESS,
        payload: response.data,
      };

      await store.dispatch(actions.fetchLocations());
      expect(mockList).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when location fetch fails', async () => {
      mockList.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchLocations());
      expect(mockList).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });

  describe('Delete location', () => {
    it('should dispatch an action when trigger delete location', async () => {
      const expectedAction = {
        type: types.DELETE_IS_LOADING,
      };

      store.dispatch(actions.deleteLocation(123));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when location delete succeeds', async () => {
      mockDelete.mockResolvedValue({ data: { locationPid: 123 } });
      const expectedAction = {
        type: types.DELETE_SUCCESS,
        payload: { locationPid: 123 },
      };

      await store.dispatch(actions.deleteLocation(123));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when location delete has error', async () => {
      const error = {
        error: { status: 500, message: 'error' },
      };
      mockDelete.mockRejectedValue(error);

      const expectedAction = {
        type: types.DELETE_HAS_ERROR,
        payload: error,
      };

      await store.dispatch(actions.deleteLocation(123));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
