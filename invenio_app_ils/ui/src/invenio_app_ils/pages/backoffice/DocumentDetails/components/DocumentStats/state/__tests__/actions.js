import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../../../../../common/api';
import { toShortDate } from '../../../../../../../common/api/date';
import { DateTime } from 'luxon';
import { invenioConfig } from '../../../../../../../common/config';
import { invenioConfig as configMock } from '../../../../../../../common/__mocks__/config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockLoanList = jest.fn();
loanApi.list = mockLoanList;

invenioConfig['circulation'] = configMock.circulation;

const ARGS = {
  documentPid: 42,
  fromDate: toShortDate(DateTime.local().minus({ days: 10 })),
  toDate: toShortDate(DateTime.local()),
};

let store;
beforeEach(() => {
  mockLoanList.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Document stats fetch tests', () => {
  it('should dispatch a loading action when fetching document stats', () => {
    const expectedAction = {
      type: types.IS_LOADING,
    };
    store.dispatch(actions.fetchDocumentStats(ARGS)).then(done => {
      expect(mockLoanList).toHaveBeenCalledWith(
        `(document_pid:${
          ARGS.documentPid
        } AND state:(ITEM_RETURNED) AND start_date:{${ARGS.fromDate} TO ${
          ARGS.toDate
        }})`
      );
      expect(store.getActions()[0]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch a success action when document stats fetch succeeds', () => {
    const expectedAction = {
      type: types.SUCCESS,
    };

    store.dispatch(actions.fetchDocumentStats(ARGS)).then(done => {
      expect(mockLoanList).toHaveBeenCalledWith(
        `(document_pid:${
          ARGS.documentPid
        } AND state:(ITEM_RETURNED) AND start_date:{${ARGS.fromDate} TO ${
          ARGS.toDate
        }})`
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch an error action when document stats fetch fails', () => {
    mockLoanList.mockRejectedValue([500, 'Error']);
    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    store.dispatch(actions.fetchDocumentStats(ARGS)).then(done => {
      expect(mockLoanList).toHaveBeenCalledWith(
        `(document_pid:${
          ARGS.documentPid
        } AND state:(ITEM_RETURNED) AND start_date:{${ARGS.fromDate} TO ${
          ARGS.toDate
        }})`
      );
      expect(store.getActions()[1]).toEqual(expectedAction);
      done();
    });
  });
});
