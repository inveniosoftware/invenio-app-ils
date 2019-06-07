import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../../../common/api';
import { sessionManager } from '../../../../../authentication/services';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
loanApi.get = mockGet;
const mockPostAction = jest.fn();
loanApi.postAction = mockPostAction;

sessionManager.user = { id: '2', locationPid: '2' };

const response = { data: {} };

const loan = {
  patron_pid: 6,
  item_pid: 3,
};

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

describe('Loan details tests', () => {
  describe('Fetch loan details tests', () => {
    it('should dispatch a loading action when fetching a loan', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchLoanDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch a success action when loan fetch succeeds', done => {
      mockGet.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: response.data,
        },
      ];

      store.dispatch(actions.fetchLoanDetails('123')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an error action when loan fetch fails', done => {
      mockGet.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchLoanDetails('456')).then(() => {
        expect(mockGet).toHaveBeenCalledWith('456');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });

  describe('Fetch loan action tests', () => {
    it('should dispatch a loading action when performing loan action', done => {
      mockPostAction.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store
        .dispatch(actions.performLoanAction('123', loan, 'urlForAction'))
        .then(() => {
          expect(mockPostAction).toHaveBeenCalledWith(
            'urlForAction',
            '123',
            loan,
            sessionManager.user.id,
            sessionManager.user.locationPid,
            {}
          );
          const actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch a success action when loan action succeeds', done => {
      mockPostAction.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: response.data,
        },
      ];

      return store
        .dispatch(actions.performLoanAction('123', loan, 'urlForAction'))
        .then(() => {
          expect(mockPostAction).toHaveBeenCalledWith(
            'urlForAction',
            '123',
            loan,
            sessionManager.user.id,
            sessionManager.user.locationPid,
            {}
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an error action when oan action fails', done => {
      mockPostAction.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      return store
        .dispatch(actions.performLoanAction('123', loan, 'wrongUrlForAction'))
        .then(() => {
          expect(mockPostAction).toHaveBeenCalledWith(
            'wrongUrlForAction',
            '123',
            loan,
            sessionManager.user.id,
            sessionManager.user.locationPid,
            {}
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });
  });
});
