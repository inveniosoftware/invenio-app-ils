import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { related as relatedApi } from '../../../../api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [{ id: 123, updated: '2018-01-01T11:05:00+01:00', metadata: {} }],
    },
  },
};

const mockFetchRelatedRecords = jest.fn();
relatedApi.get = mockFetchRelatedRecords;

let store;
beforeEach(() => {
  mockFetchRelatedRecords.mockClear();

  store = mockStore({ relatedRecords: initialState });
  store.clearActions();
});

describe('Related records tests', () => {
  describe('Fetch related records tests', () => {
    it('should dispatch a loading action when fetching records', async () => {
      mockFetchRelatedRecords.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchRelatedRecords('123', 'docid'));
      expect(mockFetchRelatedRecords).toHaveBeenCalledWith(
        '123',
        'docid',
        undefined
      );
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when records fetch succeeds', async () => {
      mockFetchRelatedRecords.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      await store.dispatch(actions.fetchRelatedRecords('123', 'docid'));
      expect(mockFetchRelatedRecords).toHaveBeenCalledWith(
        '123',
        'docid',
        undefined
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when items fetch fails', async () => {
      mockFetchRelatedRecords.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.fetchRelatedRecords('123', 'docid'));
      expect(mockFetchRelatedRecords).toHaveBeenCalledWith(
        '123',
        'docid',
        undefined
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
