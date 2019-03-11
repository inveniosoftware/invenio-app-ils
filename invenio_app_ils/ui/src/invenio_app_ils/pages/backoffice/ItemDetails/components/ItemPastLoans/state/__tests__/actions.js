import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';

import * as types from '../types';
import { loan as loanApi } from '../../../../../../../common/api';

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

const mockFetchPastOnDocumentItem = jest.fn();
loanApi.list = mockFetchPastOnDocumentItem;

let store;

beforeEach(() => {
  mockFetchPastOnDocumentItem.mockClear();

  store = mockStore({ itemPendingLoans: initialState });
  store.clearActions();
});

describe('Past loans tests', () => {
  describe('Fetch past loans tests', () => {
    it('should dispatch a loading action when fetching past loans', done => {
      mockFetchPastOnDocumentItem.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchPastLoans('456')).then(() => {
        expect(mockFetchPastOnDocumentItem).toHaveBeenCalledWith(
          '(item_pid:456 AND state:(ITEM_RETURNED OR CANCELLED))'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a success action when past loans fetch succeeds', done => {
      mockFetchPastOnDocumentItem.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      store.dispatch(actions.fetchPastLoans('456')).then(() => {
        expect(mockFetchPastOnDocumentItem).toHaveBeenCalledWith(
          '(item_pid:456 AND state:(ITEM_RETURNED OR CANCELLED))'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch an error action when past loans fetch fails', done => {
      mockFetchPastOnDocumentItem.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store.dispatch(actions.fetchPastLoans('456')).then(() => {
        expect(mockFetchPastOnDocumentItem).toHaveBeenCalledWith(
          '(item_pid:456 AND state:(ITEM_RETURNED OR CANCELLED))'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });
  });
});
