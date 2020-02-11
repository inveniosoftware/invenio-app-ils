import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import * as testData from '@testData/documents.json';
import { document as documentApi } from '@api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockCreateResponse = {
  data: {
    id: 1,
    metadata: {
      pid: '1',
      relations: {
        serial: {
          pid: '1',
          pid_type: 'serid',
          volume: '1',
        },
      },
    },
  },
};
const mockDeleteResponse = {
  data: {
    id: 1,
    metadata: {
      pid: '1',
      relations: {},
    },
  },
};

const mockCreateRelations = jest.fn();
const mockDeleteRelations = jest.fn();
documentApi.createRelation = mockCreateRelations;
documentApi.deleteRelation = mockDeleteRelations;

let store;
beforeEach(() => {
  mockCreateRelations.mockClear();

  store = mockStore({ documentRelations: initialState });
  store.clearActions();
});

const refererRecord = testData[0];

describe('Document relations tests', () => {
  describe('Create relations tests', () => {
    it('should dispatch a loading action when creating relations', async () => {
      mockCreateRelations.mockResolvedValue(mockCreateResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(
        actions.createRelations(testData[0], [{ ...testData[1] }], 'serial', {
          volume: '5',
        })
      );
      expect(mockCreateRelations).toHaveBeenCalledWith(
        testData[0],
        [{ ...testData[1] }],
        'serial',
        { volume: '5' }
      );
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when creating relations succeeds', async () => {
      mockCreateRelations.mockResolvedValue(mockCreateResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockCreateResponse.data.metadata.relations,
      };

      await store.dispatch(
        actions.createRelations(testData[0], [{ ...testData[1] }], 'serial', {
          volume: '5',
        })
      );
      expect(mockCreateRelations).toHaveBeenCalledWith(
        testData[0],
        [{ ...testData[1] }],
        'serial',
        { volume: '5' }
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when items fetch fails', async () => {
      mockCreateRelations.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(
        actions.createRelations(testData[0], [{ ...testData[1] }], 'serial', {
          volume: '5',
        })
      );
      expect(mockCreateRelations).toHaveBeenCalledWith(
        testData[0],
        [{ ...testData[1] }],
        'serial',
        { volume: '5' }
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
  describe('Delete relations tests', () => {
    it('should dispatch a loading action when deleting relations', async () => {
      mockCreateRelations.mockResolvedValue(mockDeleteResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.deleteRelations(refererRecord, testData[1]));
      expect(mockDeleteRelations).toHaveBeenCalledWith(
        refererRecord,
        testData[1]
      );
      expect(store.getActions()[0]).toEqual(expectedAction);
    });

    it('should dispatch a success action when deleting relations succeeds', async () => {
      mockDeleteRelations.mockResolvedValue(mockDeleteResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockDeleteResponse.data.metadata.relations,
      };

      await store.dispatch(actions.deleteRelations(refererRecord, testData[1]));
      expect(mockDeleteRelations).toHaveBeenCalledWith(
        refererRecord,
        testData[1]
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });

    it('should dispatch an error action when items fetch fails', async () => {
      mockDeleteRelations.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      await store.dispatch(actions.deleteRelations(refererRecord, testData[1]));
      expect(mockDeleteRelations).toHaveBeenCalledWith(
        refererRecord,
        testData[1]
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
    });
  });
});
