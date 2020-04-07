import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './actions';
import { initialState } from './reducer';
import * as types from './types';
import { series as seriesApi } from '@api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          metadata: {
            pid: '123',
            relations: {},
          },
        },
      ],
    },
  },
};

const mockFetchSeriesMultipartMonographs = jest.fn();
seriesApi.list = mockFetchSeriesMultipartMonographs;

let store;
beforeEach(() => {
  mockFetchSeriesMultipartMonographs.mockClear();

  store = mockStore({ documentItems: initialState });
  store.clearActions();
});

describe('Series Series tests', () => {
  describe('Fetch series series tests', () => {
    it('should dispatch a loading action when fetching series', async () => {
      mockFetchSeriesMultipartMonographs.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchSeriesMultipartMonographs('123'));
      expect(mockFetchSeriesMultipartMonographs).toHaveBeenCalledWith(
        'mode_of_issuance:MULTIPART_MONOGRAPH AND relations.serial.pid_type:serid AND NOT (pid:123) AND relations.serial.pid_value:123'
      );
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when series fetch succeeds', async () => {
      mockFetchSeriesMultipartMonographs.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      await store.dispatch(actions.fetchSeriesMultipartMonographs('123'));
      expect(mockFetchSeriesMultipartMonographs).toHaveBeenCalledWith(
        'mode_of_issuance:MULTIPART_MONOGRAPH AND relations.serial.pid_type:serid AND NOT (pid:123) AND relations.serial.pid_value:123'
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when series fetch fails', async () => {
      mockFetchSeriesMultipartMonographs.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchSeriesMultipartMonographs('123'));
      expect(mockFetchSeriesMultipartMonographs).toHaveBeenCalledWith(
        'mode_of_issuance:MULTIPART_MONOGRAPH AND relations.serial.pid_type:serid AND NOT (pid:123) AND relations.serial.pid_value:123'
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
