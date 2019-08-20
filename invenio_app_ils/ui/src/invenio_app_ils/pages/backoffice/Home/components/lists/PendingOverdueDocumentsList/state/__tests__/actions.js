import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: {},
        },
      ],
    },
  },
};

const param =
  'circulation.has_items_for_loan:0%20AND%20circulation.pending_loans:%3E0%20AND%20circulation.overdue_loans:%3E0%20AND%20items.total:%3E0';

const mockLoanList = jest.fn();
documentApi.list = mockLoanList;

let store;
beforeEach(() => {
  mockLoanList.mockClear();

  store = mockStore({ pendingOverdueDocuments: initialState });
  store.clearActions();
});

describe('Fetch pending overdue documents tests', () => {
  it('should dispatch a loading action when fetching documents', done => {
    mockLoanList.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.IS_LOADING,
    };

    store.dispatch(actions.fetchPendingOverdueDocuments()).then(() => {
      expect(mockLoanList).toHaveBeenCalledWith(param);
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch a success action when documents fetch succeeds', done => {
    mockLoanList.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.SUCCESS,
      payload: mockResponse.data,
    };

    store.dispatch(actions.fetchPendingOverdueDocuments()).then(() => {
      expect(mockLoanList).toHaveBeenCalledWith(param);
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch an error action when documents fetch fails', done => {
    mockLoanList.mockRejectedValue([500, 'Error']);

    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    store.dispatch(actions.fetchPendingOverdueDocuments()).then(() => {
      expect(mockLoanList).toHaveBeenCalledWith(param);
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });
});
