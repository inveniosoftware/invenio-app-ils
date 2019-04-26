import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import {
  patron as patronApi,
  document as documentApi,
} from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockRestrictionsResponse = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: {},
          links: {},
        },
      ],
    },
  },
};

const mockSearchPatrons = jest.fn();
const mockSetRestrictionsOnDocument = jest.fn();
patronApi.search = mockSearchPatrons;
documentApi.patch = mockSetRestrictionsOnDocument;

let store;
beforeEach(() => {
  mockSearchPatrons.mockClear();
  mockSetRestrictionsOnDocument.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Document access restrictions tests', () => {
  describe('Set access restrictions on document tests', () => {
    const pid = '123';
    const accessList = ['admin@test.ch', 'patron1@test.ch'];

    it('should dispatch a loading action when triggering setting the access restrictions', async () => {
      mockSetRestrictionsOnDocument.mockResolvedValue(mockRestrictionsResponse);

      const expectedAction = {
        type: types.SET_RESTRICTIONS_IS_LOADING,
      };

      await store.dispatch(actions.setRestrictionsOnDocument(pid, accessList));
      expect(mockSetRestrictionsOnDocument).toHaveBeenCalledWith('123', [
        {
          op: 'add',
          path: '/_access/read',
          value: ['admin@test.ch', 'patron1@test.ch'],
        },
      ]);
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when setting the access restrictions succeeds', async () => {
      mockSetRestrictionsOnDocument.mockResolvedValue(mockRestrictionsResponse);

      const expectedAction = {
        type: types.SET_RESTRICTIONS_SUCCESS,
        payload: mockRestrictionsResponse.data,
      };

      await store.dispatch(actions.setRestrictionsOnDocument(pid, accessList));
      expect(mockSetRestrictionsOnDocument).toHaveBeenCalledWith('123', [
        {
          op: 'add',
          path: '/_access/read',
          value: ['admin@test.ch', 'patron1@test.ch'],
        },
      ]);
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when setting access restrictions fails', async () => {
      mockSetRestrictionsOnDocument.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.SET_RESTRICTIONS_HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.setRestrictionsOnDocument(pid, accessList));
      expect(mockSetRestrictionsOnDocument).toHaveBeenCalledWith('123', [
        {
          op: 'add',
          path: '/_access/read',
          value: ['admin@test.ch', 'patron1@test.ch'],
        },
      ]);
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
