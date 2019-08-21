import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { stats as statsApi } from '../../../../../../../common/api';

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

const mockStatsMostLoaned = jest.fn();
statsApi.getMostLoanedDocuments = mockStatsMostLoaned;

let store;
beforeEach(() => {
  mockStatsMostLoaned.mockClear();

  store = mockStore({ statsMostLoanedDocuments: initialState });
  store.clearActions();
});

describe('Most loaned documents fetch tests', () => {
  const start = '2019-01-01';
  const end = '2019-03-01';

  it('should dispatch a loading action when fetching documents', done => {
    mockStatsMostLoaned.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.IS_LOADING,
    };

    store.dispatch(actions.fetchMostLoanedDocuments(start, end)).then(() => {
      expect(mockStatsMostLoaned).toHaveBeenCalledWith(start, end);
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch a success action when documents fetch succeeds', done => {
    mockStatsMostLoaned.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.SUCCESS,
      payload: mockResponse.data,
    };

    store.dispatch(actions.fetchMostLoanedDocuments(start, end)).then(() => {
      expect(mockStatsMostLoaned).toHaveBeenCalledWith(start, end);
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch an error action when documents fetch fails', done => {
    mockStatsMostLoaned.mockRejectedValue([500, 'Error']);

    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    store.dispatch(actions.fetchMostLoanedDocuments(start, end)).then(() => {
      expect(mockStatsMostLoaned).toHaveBeenCalledWith(start, end);
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });
});
