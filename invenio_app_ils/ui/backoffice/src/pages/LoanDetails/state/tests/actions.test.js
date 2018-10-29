import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { http } from 'common/api';
// Actions to be tested
import * as actions from '../actions';
import { initialState } from '../reducer';
import { serializeLoanDetails } from '../selectors';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const loansBaseUrl = 'https://127.0.0.1:5000/api/circulation/loans';

describe('loan actions', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
    store.clearActions();
  });

  describe('fetch loan details', () => {
    let mock;
    let response = {};
    beforeEach(() => {
      mock = new MockAdapter(http);
      mock.onGet(`${loansBaseUrl}/1`).reply(() => {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            resolve([200, JSON.stringify(response)]);
          }, 1000)
        );
      });
      mock.onGet(`${loansBaseUrl}/2`).reply(() => {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            reject([500, 'Error']);
          }, 1000)
        );
      });
    });

    it('fires a fetch loan details action', done => {
      const expectedActions = [
        {
          type: types.SET_LOAN_FETCH_LOADING,
        },
      ];

      store
        .dispatch(actions.fetchLoanDetails(`${loansBaseUrl}/1/next`))
        .then(() => {
          let actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('fires an event when the loan fetch succeeds', done => {
      const expectedActions = [
        {
          type: types.LOAN_FETCH_DETAILS_SUCCESS,
          payload: serializeLoanDetails(response),
        },
      ];

      store.dispatch(actions.fetchLoanDetails(1)).then(() => {
        let actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('fires an event when the loan fetch fails', done => {
      const expectedActions = [
        {
          type: types.SET_LOAN_ACTION_ERROR,
          payload: 2,
        },
      ];

      store.dispatch(actions.fetchLoanDetails(2)).then(() => {
        let actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });

  describe('trigger action on loan', () => {
    let mock;
    let response = {};
    beforeEach(() => {
      mock = new MockAdapter(http);
      mock.onPost(`${loansBaseUrl}/1/next`).reply(() => {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            resolve([200, JSON.stringify(response)]);
          }, 1000)
        );
      });
      mock.onPost(`${loansBaseUrl}/2/next`).reply(() => {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            reject('Error');
          }, 1000)
        );
      });
    });

    it('fires a loan transition action', done => {
      const expectedActions = [
        {
          type: types.SET_LOAN_ACTION_LOADING,
        },
      ];

      store
        .dispatch(actions.postLoanAction(`${loansBaseUrl}/1/next`, {}))
        .then(() => {
          let actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('fires an event when the loan transition action succeeds', done => {
      const expectedActions = [
        {
          type: types.LOAN_ACTION_SUCCESS,
          payload: serializeLoanDetails(response),
        },
      ];

      return store
        .dispatch(actions.postLoanAction(`${loansBaseUrl}/1/next`, {}))
        .then(() => {
          let actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('fires an event when the loan transition action fails', done => {
      const expectedActions = [
        {
          type: types.SET_LOAN_ACTION_ERROR,
          payload: 'Error',
        },
      ];

      return store
        .dispatch(actions.postLoanAction(`${loansBaseUrl}/2/next`, {}))
        .then(() => {
          let actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });
  });
});
