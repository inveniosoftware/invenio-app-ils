import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './actions';
import { initialState } from './reducer';
import * as types from './types';
import { illBorrowingRequest as borrowingRequestApi } from '@api';
import { sessionManager } from '@authentication/services';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
borrowingRequestApi.get = mockGet;
const mockPostAction = jest.fn();
borrowingRequestApi.postAction = mockPostAction;

sessionManager.user = { id: '2', locationPid: '2' };

const response = { data: {} };

const _initialState = {
  ...initialState,
  userSession: {
    userPid: 1,
    locationPid: 3,
  },
};

let store;
beforeEach(() => {
  mockGet.mockClear();
  mockPostAction.mockClear();

  store = mockStore(_initialState);
  store.clearActions();
});

describe('BorrowingRequest details tests', () => {
  describe('Fetch borrowingRequest details tests', () => {
    it('should dispatch a loading action when fetching a borrowingRequest', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchBorrowingRequestDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch a success action when borrowingRequest fetch succeeds', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: response.data,
        },
      ];

      store.dispatch(actions.fetchBorrowingRequestDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an error action when borrowingRequest fetch fails', done => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchBorrowingRequestDetails('456')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('456');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
