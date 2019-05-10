import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
const mockDelete = jest.fn();

documentApi.get = mockGet;
documentApi.delete = mockDelete;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGet.mockClear();
  mockDelete.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Document details actions', () => {
  describe('Fetch document details tests', () => {
    it('should dispatch an action when fetching an document', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchDocumentDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when document fetch succeeds', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchDocumentDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when document fetch fails', done => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchDocumentDetails('456')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('456');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });

  describe('Delete document tests', () => {
    it('should dispatch an action when trigger delete document', async () => {
      const expectedAction = {
        type: types.DELETE_IS_LOADING,
      };

      store.dispatch(actions.deleteDocument(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch an action when document delete succeeds', async () => {
      mockDelete.mockResolvedValue({ data: { documentPid: 1 } });
      const expectedAction = {
        type: types.DELETE_SUCCESS,
        payload: { documentPid: 1 },
      };

      await store.dispatch(actions.deleteDocument(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an action when document delete has error', async () => {
      const error = {
        error: { status: 500, message: 'error' },
      };
      mockDelete.mockRejectedValue(error);

      const expectedAction = {
        type: types.DELETE_HAS_ERROR,
        payload: error,
      };

      await store.dispatch(actions.deleteDocument(1));
      expect(mockDelete).toHaveBeenCalled();
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
