import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '@api';
import * as testData from '@testData/loans.json';
import { sessionManager } from '@authentication/services';
import { toShortDate } from '@api/date';
import { DateTime } from 'luxon';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockDoRequest = jest.fn();
loanApi.doRequest = mockDoRequest;

const response = { data: { ...testData[0] } };
const expectedPayload = {
  ...testData[0],
};
sessionManager.user = { id: '2', locationPid: '2' };
const documentPid = '123';
const userId = '2';
const requestStartDate = toShortDate(DateTime.local());
const requestEndDate = '2020-09-21';

let store;
beforeEach(() => {
  mockDoRequest.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Loan Request form actions', () => {
  describe('Request a loan tests', () => {
    it('should dispatch an action when requesting a loan without delivery and end date', async () => {
      mockDoRequest.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      await store.dispatch(actions.requestLoanForDocument(documentPid));
      expect(mockDoRequest).toHaveBeenCalledWith(documentPid, userId, {
        requestExpireDate: null,
        requestStartDate: requestStartDate,
        deliveryMethod: null,
      });
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual(expectedActions[0]);
    });

    it('should dispatch an action when requesting a loan with delivery but no end date', async () => {
      mockDoRequest.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      await store.dispatch(
        actions.requestLoanForDocument(documentPid, {
          deliveryMethod: 'PICKUP',
        })
      );
      expect(mockDoRequest).toHaveBeenCalledWith(documentPid, userId, {
        requestExpireDate: null,
        requestStartDate: requestStartDate,
        deliveryMethod: 'PICKUP',
      });
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual(expectedActions[0]);
    });

    it('should dispatch an action when requesting a loan with delivery and end date', async () => {
      mockDoRequest.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      await store.dispatch(
        actions.requestLoanForDocument(documentPid, {
          requestEndDate: requestEndDate,
          deliveryMethod: 'PICKUP',
        })
      );
      expect(mockDoRequest).toHaveBeenCalledWith(documentPid, userId, {
        requestExpireDate: requestEndDate,
        requestStartDate: requestStartDate,
        deliveryMethod: 'PICKUP',
      });
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual(expectedActions[0]);
    });

    it('should dispatch an action when request succeeds', async () => {
      mockDoRequest.mockResolvedValue(response);

      const expectedActions = [
        {
          type: 'requestLoan/SUCCESS',
          payload: expectedPayload,
        },
      ];

      await store.dispatch(actions.requestLoanForDocument(documentPid));

      expect(mockDoRequest).toHaveBeenCalledWith(documentPid, userId, {
        requestStartDate: requestStartDate,
        requestExpireDate: null,
        deliveryMethod: null,
      });
      const storeActions = store.getActions();
      expect(storeActions[1]).toEqual(expectedActions[0]);
    });

    it('should dispatch an action when request fails', async () => {
      mockDoRequest.mockRejectedValue([500, 'Error']);

      const storeActions = store.getActions();

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      await store.dispatch(actions.requestLoanForDocument(documentPid));
      expect(mockDoRequest).toHaveBeenCalledWith(documentPid, userId, {
        requestStartDate: requestStartDate,
        requestExpireDate: null,
        deliveryMethod: null,
      });
      expect(storeActions[1]).toEqual(expectedActions[0]);
    });
  });
});
