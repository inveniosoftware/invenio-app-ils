import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../../../../../common/api';
import { ApiURLS } from '../../../../../../../common/api/urls';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockPOST = jest.fn();
loanApi.postAction = mockPOST;

const response = { data: {} };
const expectedPayload = {};

const item = { item_pid: '2' };
const user_pid = '2';
const postURL = `${ApiURLS.loans.list}create`;
import { sessionManager } from '../../../../../../../authentication/services';

sessionManager.user = { id: '2', locationPid: '2' };

let store;
beforeEach(() => {
  mockPOST.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('ItemsCheckout actions tests', () => {
  describe('POST Loan for checkout', () => {
    const loan = { ...item, patron_pid: user_pid };

    it('should dispatch an action when checkout', done => {
      mockPOST.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.checkoutItem(item, user_pid)).then(() => {
        expect(mockPOST).toHaveBeenCalledWith(
          postURL,
          item.item_pid,
          loan,
          sessionManager.user.id,
          sessionManager.user.locationPid
        );

        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when user fetch succeeds', done => {
      mockPOST.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.checkoutItem(item, user_pid)).then(() => {
        expect(mockPOST).toHaveBeenCalledWith(
          postURL,
          item.item_pid,
          loan,
          sessionManager.user.id,
          sessionManager.user.locationPid
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when user fetch fails', done => {
      mockPOST.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.checkoutItem(item, user_pid)).then(() => {
        expect(mockPOST).toHaveBeenCalledWith(
          postURL,
          item.item_pid,
          loan,
          sessionManager.user.id,
          sessionManager.user.locationPid
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
