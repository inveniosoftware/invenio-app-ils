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

const mockFetchPendingOnDocument = jest.fn();
loanApi.list = mockFetchPendingOnDocument;

let store;
beforeEach(() => {
  mockFetchPendingOnDocument.mockClear();

  store = mockStore({ documentPendingLoans: initialState });
  store.clearActions();
});

describe('Pending loans tests', () => {
  describe('Fetch pending loans tests', () => {
    it('should dispatch a loading action when fetching pending loans', done => {
      mockFetchPendingOnDocument.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchPendingLoans('123')).then(() => {
        expect(mockFetchPendingOnDocument).toHaveBeenCalledWith(
          '(document_pid:123 AND state:PENDING)'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a success action when pending loans fetch succeeds', done => {
      mockFetchPendingOnDocument.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      store.dispatch(actions.fetchPendingLoans('123')).then(() => {
        expect(mockFetchPendingOnDocument).toHaveBeenCalledWith(
          '(document_pid:123 AND state:PENDING)'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch an error action when pending loans fetch fails', done => {
      mockFetchPendingOnDocument.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store.dispatch(actions.fetchPendingLoans('123')).then(() => {
        expect(mockFetchPendingOnDocument).toHaveBeenCalledWith(
          '(document_pid:123 AND state:PENDING)'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });
  });
});
