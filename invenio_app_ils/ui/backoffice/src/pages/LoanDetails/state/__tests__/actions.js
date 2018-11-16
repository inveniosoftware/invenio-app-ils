import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { http } from 'common/api';
import * as actions from '../actions';
import { initialState } from '../reducer';
import { serializeLoanDetails } from '../selectors';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const loansBaseUrl = 'https://127.0.0.1:5000/api/circulation/loans';
const _initialState = {
  ...initialState,
  userSession: {
    userPid: 1,
    locationPid: 3,
  },
};
const loan = {
  patron_pid: 6,
  item_pid: 3,
};

let store;
beforeEach(() => {
  store = mockStore(_initialState);
  store.clearActions();
});

describe('Loan item details tests', () => {
  describe('Fetch loan details tests', () => {
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

    it('should dispatch a loading action when fetching a loan', done => {
      const expectedActions = [
        {
          type: types.IS_LOADING,
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

    it('should dispatch a success action when loan fetch succeeds', done => {
      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: serializeLoanDetails(response),
        },
      ];

      store.dispatch(actions.fetchLoanDetails(1)).then(() => {
        let actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an error action when loan fetch fails', done => {
      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchLoanDetails(2)).then(() => {
        let actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });

  describe('Fetch loan action tests', () => {
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

    it('should dispatch a loading action when performing loan action', done => {
      const expectedActions = [
        {
          type: types.ACTION_IS_LOADING,
        },
      ];

      store
        .dispatch(
          actions.performLoanAction('123', loan, `${loansBaseUrl}/1/next`)
        )
        .then(() => {
          let actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch a success action when loan action succeeds', done => {
      const expectedActions = [
        {
          type: types.ACTION_SUCCESS,
          payload: serializeLoanDetails(response),
        },
      ];

      return store
        .dispatch(
          actions.performLoanAction('123', loan, `${loansBaseUrl}/1/next`)
        )
        .then(() => {
          let actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an error action when oan action fails', done => {
      const expectedActions = [
        {
          type: types.ACTION_HAS_ERROR,
          payload: 'Error',
        },
      ];

      return store
        .dispatch(
          actions.performLoanAction('123', loan, `${loansBaseUrl}/2/next`)
        )
        .then(() => {
          let actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should raise an error when the loan action does not contain item or document pid', async () => {
      expect.assertions(1);
      try {
        await store.dispatch(
          actions.performLoanAction(
            '123',
            {
              patron_pid: 5455,
            },
            `${loansBaseUrl}/1/next`
          )
        );
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });
});
