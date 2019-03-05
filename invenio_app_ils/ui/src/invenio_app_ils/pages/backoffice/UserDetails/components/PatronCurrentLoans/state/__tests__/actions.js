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
          id: '123',
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: { loan_pid: '123' },
        },
      ],
    },
  },
};

const mockFetchPatronCurrentLoans = jest.fn();
loanApi.list = mockFetchPatronCurrentLoans;

let store;
beforeEach(() => {
  mockFetchPatronCurrentLoans.mockClear();

  store = mockStore({ patronCurrentLoans: initialState });
  store.clearActions();
});

describe('Patron current loans tests', () => {
  describe('fetch Patron current loans tests', () => {
    it('should dispatch a loading action when fetching patron loans', done => {
      mockFetchPatronCurrentLoans.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.IS_LOADING,
      };

      store.dispatch(actions.fetchPatronCurrentLoans(2)).then(() => {
        expect(mockFetchPatronCurrentLoans).toHaveBeenCalledWith(
          '(patron_pid:2 AND state:ITEM_ON_LOAN)&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a success action when patron loans fetch succeeds', done => {
      mockFetchPatronCurrentLoans.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: types.SUCCESS,
        payload: mockResponse.data,
      };

      store.dispatch(actions.fetchPatronCurrentLoans(2)).then(() => {
        expect(mockFetchPatronCurrentLoans).toHaveBeenCalledWith(
          '(patron_pid:2 AND state:ITEM_ON_LOAN)&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch an error action when patron loans fetch fails', done => {
      mockFetchPatronCurrentLoans.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: types.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store.dispatch(actions.fetchPatronCurrentLoans(2)).then(() => {
        expect(mockFetchPatronCurrentLoans).toHaveBeenCalledWith(
          '(patron_pid:2 AND state:ITEM_ON_LOAN)&sort=-mostrecent'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });
  });
});
