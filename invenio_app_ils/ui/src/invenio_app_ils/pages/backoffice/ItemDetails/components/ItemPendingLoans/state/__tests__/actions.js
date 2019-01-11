import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import { serializePendingLoan } from '../selectors';
import * as types from '../types';
import { loan as loanApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [{ id: '123', updated: '2018-01-01T11:05:00+01:00', metadata: {} }],
    },
  },
};

const mockFetchPendingOnDocumentItem = jest.fn();
loanApi.fetchLoans = mockFetchPendingOnDocumentItem;

let store;
beforeEach(() => {
  mockFetchPendingOnDocumentItem.mockClear();

  store = mockStore({ itemPendingLoans: initialState });
  store.clearActions();
});

describe('Pending loans tests', () => {
  describe('Fetch pending loans tests', () => {
    it('should dispatch a loading action when fetching pending loans', done => {
      mockFetchPendingOnDocumentItem.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchPendingLoans('123', '456')).then(() => {
        expect(mockFetchPendingOnDocumentItem).toHaveBeenCalledWith(
          '123',
          '456',
          initialState.sortBy,
          initialState.sortOrder,
          null,
          'PENDING'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a success action when pending loans fetch succeeds', done => {
      mockFetchPendingOnDocumentItem.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data.hits.hits.map(hit =>
          serializePendingLoan(hit)
        ),
      };

      store.dispatch(actions.fetchPendingLoans('123', '456')).then(() => {
        expect(mockFetchPendingOnDocumentItem).toHaveBeenCalledWith(
          '123',
          '456',
          initialState.sortBy,
          initialState.sortOrder,
          null,
          'PENDING'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch an error action when pending loans fetch fails', done => {
      mockFetchPendingOnDocumentItem.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store.dispatch(actions.fetchPendingLoans('123', '456')).then(() => {
        expect(mockFetchPendingOnDocumentItem).toHaveBeenCalledWith(
          '123',
          '456',
          initialState.sortBy,
          initialState.sortOrder,
          null,
          'PENDING'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });
  });
});

describe('Fetch change sort by when fetching pending loans tests', () => {
  it('should dispatch a change sort by action with `start_date` when calling pendingLoansChangeSortBy the first time', done => {
    mockFetchPendingOnDocumentItem.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.CHANGE_SORT_BY,
      payload: 'start_date',
    };

    store.dispatch(actions.pendingLoansChangeSortBy('111', '222')).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      expect(mockFetchPendingOnDocumentItem).toHaveBeenCalled();
      done();
    });
  });

  it('should dispatch a change sort by action with `transaction_date` when calling pendingLoansChangeSortBy the second time', done => {
    mockFetchPendingOnDocumentItem.mockResolvedValue(mockResponse);
    store.getState().itemPendingLoans.sortBy = 'start_date';

    const expectedAction = {
      type: types.CHANGE_SORT_BY,
      payload: 'transaction_date',
    };

    store.dispatch(actions.pendingLoansChangeSortBy('999', '888')).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      expect(mockFetchPendingOnDocumentItem).toHaveBeenCalled();
      done();
    });
  });
});

describe('Fetch change sort order when fetching pending loans tests', () => {
  it('should dispatch a change sort order action with `desc` when calling pendingLoansChangeSortOrder the first time', done => {
    mockFetchPendingOnDocumentItem.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.CHANGE_SORT_ORDER,
      payload: 'desc',
    };

    store
      .dispatch(actions.pendingLoansChangeSortOrder('123', '456'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        expect(mockFetchPendingOnDocumentItem).toHaveBeenCalled();
        done();
      });
  });

  it('should dispatch a change sort by action with `asc` when calling pendingLoansChangeSortOrder the second time', done => {
    mockFetchPendingOnDocumentItem.mockResolvedValue(mockResponse);
    store.getState().itemPendingLoans.sortOrder = 'desc';

    const expectedAction = {
      type: types.CHANGE_SORT_ORDER,
      payload: 'asc',
    };

    store
      .dispatch(actions.pendingLoansChangeSortOrder('123', '456'))
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        expect(mockFetchPendingOnDocumentItem).toHaveBeenCalled();
        done();
      });
  });
});
