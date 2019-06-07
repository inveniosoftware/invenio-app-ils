import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [{ id: 123, updated: '2018-01-01T11:05:00+01:00', metadata: {} }],
    },
  },
};

const mockFetchSeriesDocuments = jest.fn();
documentApi.list = mockFetchSeriesDocuments;

let store;
beforeEach(() => {
  mockFetchSeriesDocuments.mockClear();

  store = mockStore({ documentItems: initialState });
  store.clearActions();
});

describe('Series Document tests', () => {
  describe('Fetch series document tests', () => {
    it('should dispatch a loading action when fetching documents', async () => {
      mockFetchSeriesDocuments.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchSeriesDocuments('123'));
      expect(mockFetchSeriesDocuments).toHaveBeenCalledWith(
        'series.series_pid:123'
      );
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when documents fetch succeeds', async () => {
      mockFetchSeriesDocuments.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      await store.dispatch(actions.fetchSeriesDocuments('123'));
      expect(mockFetchSeriesDocuments).toHaveBeenCalledWith(
        'series.series_pid:123'
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when documents fetch fails', async () => {
      mockFetchSeriesDocuments.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchSeriesDocuments('123'));
      expect(mockFetchSeriesDocuments).toHaveBeenCalledWith(
        'series.series_pid:123'
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
