import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { item as itemApi } from '../../../../../../../common/api';

jest.mock('../../../../../../../common/config');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockList = jest.fn();
itemApi.list = mockList;

const response = {
  data: {
    hits: {
      hits: [
        {
          id: 987,
          created: '2018-01-01T11:05:00+01:00',
          updated: '2018-01-01T11:05:00+01:00',
          metadata: {
            barcode: '9865745223',
            document_pid: 1342,
            document: {
              document_pid: 1342,
            },
            status: 'CAN_CIRCULATE',
            internal_location_pid: 1,
            internal_location: {
              name: 'A library',
              internal_location_pid: 1,
            },
          },
        },
        {
          id: 988,
          created: '2018-01-01T11:05:00+01:00',
          updated: '2018-01-01T11:05:00+01:00',
          metadata: {
            barcode: '9865745224',
            document_pid: 1342,
            document: {
              document_pid: 1342,
            },
            status: 'CAN_CIRCULATE',
            internal_location_pid: 1,
            internal_location: {
              name: 'A library',
              internal_location_pid: 1,
            },
          },
        },
      ],
    },
  },
};

let store;
beforeEach(() => {
  mockList.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Available items tests', () => {
  describe('Fetch available items tests', () => {
    it('should dispatch a loading action when fetching available items', async () => {
      mockList.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchAvailableItems('1342'));
      expect(mockList).toHaveBeenCalledWith(
        'document_pid:1342 AND status:CAN_CIRCULATE AND NOT circulation_status:*'
      );
      expect(store.getActions()[0]).toEqual(expectedActions[0]);
    });

    it('should dispatch a success action when available items fetch succeeds', done => {
      mockList.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: response.data,
        },
      ];

      store.dispatch(actions.fetchAvailableItems('1342')).then(() => {
        expect(mockList).toHaveBeenCalledWith(
          'document_pid:1342 AND status:CAN_CIRCULATE AND NOT circulation_status:*'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an error action when available items fetch fails', done => {
      mockList.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchAvailableItems('456')).then(() => {
        expect(mockList).toHaveBeenCalledWith(
          'document_pid:456 AND status:CAN_CIRCULATE AND NOT circulation_status:*'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
