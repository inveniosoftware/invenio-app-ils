import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../api';
import { ES_DELAY } from '../../../config';
import { invenioConfig } from '../../../config';
import { invenioConfig as configMock } from '../../../__mocks__/config';

invenioConfig['circulation'] = configMock.circulation;

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
          metadata: { loan_pid: '123' },
        },
      ],
    },
  },
};

const mockFetchPatronPasttLoans = jest.fn();
loanApi.list = mockFetchPatronPasttLoans;

let store;
beforeEach(() => {
  mockFetchPatronPasttLoans.mockClear();

  store = mockStore({ patronPastLoans: initialState });
  store.clearActions();
});

describe('Patron past loans tests', () => {
  it('should dispatch a loading action when fetching patron loans', async () => {
    mockFetchPatronPasttLoans.mockResolvedValue(mockResponse);
    const expectedAction = {
      type: types.IS_LOADING,
    };
    await store.dispatch(actions.fetchPatronPastLoans(2));
    expect(mockFetchPatronPasttLoans).toHaveBeenCalledWith(
      '(patron_pid:2 AND state:(ITEM_RETURNED))&sort=-mostrecent'
    );
    expect(store.getActions()[0]).toEqual(expectedAction);
  });

  it('should dispatch a success action when patron loans fetch succeeds', async () => {
    mockFetchPatronPasttLoans.mockResolvedValue(mockResponse);
    const expectedAction = {
      type: types.SUCCESS,
      payload: mockResponse.data,
    };
    await store.dispatch(actions.fetchPatronPastLoans(2));
    expect(mockFetchPatronPasttLoans).toHaveBeenCalledWith(
      '(patron_pid:2 AND state:(ITEM_RETURNED))&sort=-mostrecent'
    );
    expect(store.getActions()[1]).toEqual(expectedAction);
  });

  it('should dispatch an error action when patron loans fetch fails', async () => {
    mockFetchPatronPasttLoans.mockRejectedValue([500, 'Error']);
    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };
    await store.dispatch(actions.fetchPatronPastLoans(2));
    expect(mockFetchPatronPasttLoans).toHaveBeenCalledWith(
      '(patron_pid:2 AND state:(ITEM_RETURNED))&sort=-mostrecent'
    );
    expect(store.getActions()[1]).toEqual(expectedAction);
  });

  it('should dispatch a delayed loading action when fetching patron loans', async () => {
    mockFetchPatronPasttLoans.mockResolvedValue(mockResponse);
    const expectedAction = {
      type: types.IS_LOADING,
    };
    await store.dispatch(actions.fetchPatronPastLoans(2, ES_DELAY));
    expect(mockFetchPatronPasttLoans).toHaveBeenCalledWith(
      '(patron_pid:2 AND state:(ITEM_RETURNED))&sort=-mostrecent'
    );
    expect(store.getActions()[0]).toEqual(expectedAction);
  });
});
