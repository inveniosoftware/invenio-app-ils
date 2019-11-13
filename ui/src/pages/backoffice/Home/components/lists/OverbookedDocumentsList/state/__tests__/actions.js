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

const mockDocumentList = jest.fn();
documentApi.list = mockDocumentList;

let store;
beforeEach(() => {
  mockDocumentList.mockClear();

  store = mockStore({ overbookedDocuments: initialState });
  store.clearActions();
});

describe('Loans renewed more then 3 times (last week) fetch tests', () => {
  it('should dispatch a loading action when fetching loans', done => {
    mockDocumentList.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.IS_LOADING,
    };

    store.dispatch(actions.fetchOverbookedDocuments()).then(() => {
      expect(mockDocumentList).toHaveBeenCalledWith(
        'circulation.overbooked:true'
      );
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch a success action when loans fetch succeeds', done => {
    mockDocumentList.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.SUCCESS,
      payload: mockResponse.data,
    };

    store.dispatch(actions.fetchOverbookedDocuments()).then(() => {
      expect(mockDocumentList).toHaveBeenCalledWith(
        'circulation.overbooked:true'
      );
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch an error action when loans fetch fails', done => {
    mockDocumentList.mockRejectedValue([500, 'Error']);

    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    store.dispatch(actions.fetchOverbookedDocuments()).then(() => {
      expect(mockDocumentList).toHaveBeenCalledWith(
        'circulation.overbooked:true'
      );
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });
});
