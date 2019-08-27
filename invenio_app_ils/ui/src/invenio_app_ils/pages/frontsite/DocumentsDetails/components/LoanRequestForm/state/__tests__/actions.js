import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../../../../../common/api';
import * as testData from '../../../../../../../../../../../tests/data/loans.json';
import { sessionManager } from '../../../../../../../authentication/services';
import { ApiURLS } from '../../../../../../../common/api/urls';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockPost = jest.fn();
loanApi.postAction = mockPost;

const response = { data: { ...testData[0] } };
const expectedPayload = {
  content: 'You have requested to loan this book.',
  title: 'Success!',
  type: 'success',
};

sessionManager.user = { id: '2', locationPid: '2' };

let store;
beforeEach(() => {
  mockPost.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

const docPid = '123';

const loanData = {
  metadata: {
    start_date: '2019-08-17',
    end_date: '2019-09-17',
    document_pid: docPid,
    patron_pid: '4',
  },
};

describe('Document details actions', () => {
  describe('Fetch document details tests', () => {
    it('should dispatch an action when fetching an item', async () => {
      mockPost.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      await store.dispatch(actions.requestLoanForDocument(docPid, loanData));
      expect(mockPost).toHaveBeenCalledWith(
        ApiURLS.loans.request,
        docPid,
        loanData,
        '2',
        '2',
        {
          start_date: loanData.metadata.start_date,
          end_date: loanData.metadata.end_date,
        }
      );
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual(expectedActions[0]);
    });

    it('should dispatch an action when document fetch succeeds', async () => {
      mockPost.mockResolvedValue(response);

      const expectedActions = [
        {
          type: 'notifications/ADD',
          payload: expectedPayload,
        },
      ];

      await store.dispatch(actions.requestLoanForDocument(docPid, loanData));

      expect(mockPost).toHaveBeenCalledWith(
        ApiURLS.loans.request,
        docPid,
        loanData,
        '2',
        '2',
        {
          start_date: loanData.metadata.start_date,
          end_date: loanData.metadata.end_date,
        }
      );
      const storeActions = store.getActions();
      expect(storeActions[1]).toEqual(expectedActions[0]);
    });

    it('should dispatch an action when document fetch fails', async () => {
      mockPost.mockRejectedValue([500, 'Error']);

      const storeActions = store.getActions();

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      await store.dispatch(actions.requestLoanForDocument(docPid, loanData));
      expect(mockPost).toHaveBeenCalledWith(
        ApiURLS.loans.request,
        docPid,
        loanData,
        '2',
        '2',
        {
          start_date: loanData.metadata.start_date,
          end_date: loanData.metadata.end_date,
        }
      );
      expect(storeActions[1]).toEqual(expectedActions[0]);
    });
  });
});
