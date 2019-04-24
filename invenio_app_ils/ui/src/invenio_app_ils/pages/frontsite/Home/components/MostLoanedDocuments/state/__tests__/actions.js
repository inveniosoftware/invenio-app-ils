import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { document as documentApi } from '../../../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockFetchMostLoanedDocs = jest.fn();
documentApi.list = mockFetchMostLoanedDocs;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockFetchMostLoanedDocs.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Most loaned documents actions', () => {
  describe('Fetch most loaned documents tests', () => {
    it('should dispatch an action when fetching most loaned documents', done => {
      mockFetchMostLoanedDocs.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchMostLoanedDocuments()).then(() => {
        expect(mockFetchMostLoanedDocs).toHaveBeenCalledWith(
          'circulation.active_loans:>0& AND &sort=mostloaned'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most loaned documents fetch succeeds', done => {
      mockFetchMostLoanedDocs.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store.dispatch(actions.fetchMostLoanedDocuments()).then(() => {
        expect(mockFetchMostLoanedDocs).toHaveBeenCalledWith(
          'circulation.active_loans:>0& AND &sort=mostloaned'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when most loaned documents fetch fails', done => {
      mockFetchMostLoanedDocs.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchMostLoanedDocuments()).then(() => {
        expect(mockFetchMostLoanedDocs).toHaveBeenCalledWith(
          'circulation.active_loans:>0& AND &sort=mostloaned'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
