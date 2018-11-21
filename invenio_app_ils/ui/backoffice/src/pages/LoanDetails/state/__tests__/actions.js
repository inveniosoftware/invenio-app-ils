import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import { serializeLoanDetails } from '../selectors';
import * as types from '../types';
import { loan as loanApi } from 'common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGetRecord = jest.fn();
loanApi.getRecord = mockGetRecord;
const mockPostAction = jest.fn();
loanApi.postAction = mockPostAction;

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
  mockGetRecord.mockClear();
  mockPostAction.mockClear();

  store = mockStore(_initialState);
  store.clearActions();
});

describe('Loan details tests', () => {
  describe('Fetch loan details tests', () => {
    it('should dispatch a loading action when fetching a loan', done => {
      mockGetRecord.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchLoanDetails('123')).then(() => {
        expect(mockGetRecord).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch a success action when loan fetch succeeds', done => {
      mockGetRecord.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: serializeLoanDetails(response.data),
        },
      ];

      store.dispatch(actions.fetchLoanDetails('123')).then(() => {
        expect(mockGetRecord).toHaveBeenCalledWith('123');
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an error action when loan fetch fails', done => {
      mockGetRecord.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchLoanDetails('456')).then(() => {
        expect(mockGetRecord).toHaveBeenCalledWith('456');
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
          type: types.ACTION_IS_LOADING,
        },
      ];

      store
        .dispatch(actions.performLoanAction('123', loan, 'urlForAction'))
        .then(() => {
          expect(mockPostAction).toHaveBeenCalledWith(
            'urlForAction',
            '123',
            loan,
            1,
            3
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
          type: types.ACTION_SUCCESS,
          payload: serializeLoanDetails(response.data),
        },
      ];

      return store
        .dispatch(actions.performLoanAction('123', loan, 'urlForAction'))
        .then(() => {
          expect(mockPostAction).toHaveBeenCalledWith(
            'urlForAction',
            '123',
            loan,
            1,
            3
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
          type: types.ACTION_HAS_ERROR,
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
            1,
            3
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });
  });
});
