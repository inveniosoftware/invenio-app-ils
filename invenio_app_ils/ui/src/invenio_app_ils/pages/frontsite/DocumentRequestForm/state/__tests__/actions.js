import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { documentRequest as documentRequestApi } from '../../../../../common/api';
import { sessionManager } from '../../../../../authentication/services';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockCreate = jest.fn();
documentRequestApi.create = mockCreate;

sessionManager.user = { id: '2', locationPid: '2' };

const response = { data: {} };

const createActions = {
  setSubmitting: jest.fn(),
};

const documentRequest = {
  pid: '123',
  patron_pid: '1',
  state: 'PENDING',
  title: 'test',
};

const _initialState = {
  ...initialState,
};

let store;
beforeEach(() => {
  mockCreate.mockClear();

  store = mockStore(_initialState);
  store.clearActions();
});

describe('DocumentRequest tests', () => {
  describe('Create document request test', () => {
    it('should dispatch a loading action when creating a documentRequest', done => {
      mockCreate.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store
        .dispatch(actions.createDocumentRequest(documentRequest, createActions))
        .then(() => {
          expect(mockCreate).toHaveBeenCalledWith(documentRequest);
          const actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an error action when documentRequest fetch fails', done => {
      mockCreate.mockRejectedValue({
        response: {
          data: {
            errors: [],
          },
        },
      });

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: {},
        },
      ];

      store
        .dispatch(actions.createDocumentRequest(documentRequest, createActions))
        .then(() => {
          expect(mockCreate).toHaveBeenCalledWith(documentRequest);
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });
  });
});
