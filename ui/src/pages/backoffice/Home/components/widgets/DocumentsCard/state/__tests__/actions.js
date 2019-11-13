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

const mockDocumentsCount = jest.fn();
documentApi.count = mockDocumentsCount;

let store;
beforeEach(() => {
  mockDocumentsCount.mockClear();

  store = mockStore({ documentsCard: initialState });
  store.clearActions();
});

describe('Documents with items on shelf tests', () => {
  it('should dispatch a loading action when fetching documents', done => {
    mockDocumentsCount.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.IS_LOADING,
    };

    store.dispatch(actions.fetchRequestedWithAvailableItems()).then(() => {
      expect(mockDocumentsCount).toHaveBeenCalledWith(
        'circulation.has_items_for_loan:>0 AND circulation.pending_loans:>0'
      );
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch a success action when documents fetch succeeds', done => {
    mockDocumentsCount.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.SUCCESS,
      payload: mockResponse.data,
    };

    store.dispatch(actions.fetchRequestedWithAvailableItems()).then(() => {
      expect(mockDocumentsCount).toHaveBeenCalledWith(
        'circulation.has_items_for_loan:>0 AND circulation.pending_loans:>0'
      );
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch an error action when documents fetch fails', done => {
    mockDocumentsCount.mockRejectedValue([500, 'Error']);

    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    store.dispatch(actions.fetchRequestedWithAvailableItems()).then(() => {
      expect(mockDocumentsCount).toHaveBeenCalledWith(
        'circulation.has_items_for_loan:>0 AND circulation.pending_loans:>0'
      );
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });
});
