import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { location as locationApi } from '../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockList = jest.fn();
locationApi.list = mockList;

const response = {
  data: {
    hits: {
      hits: [
        {
          id: '123',
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: {},
          links: { self: 'l' },
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

describe('Location details actions', () => {
  describe('Fetch location details tests', () => {
    it('should dispatch an action when fetching locations', done => {
      mockList.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store.dispatch(actions.fetchLocations()).then(() => {
        expect(mockList).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when location fetch succeeds', done => {
      mockList.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: response.data,
        },
      ];

      store.dispatch(actions.fetchLocations()).then(() => {
        expect(mockList).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when location fetch fails', done => {
      mockList.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchLocations()).then(() => {
        expect(mockList).toHaveBeenCalled();
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
