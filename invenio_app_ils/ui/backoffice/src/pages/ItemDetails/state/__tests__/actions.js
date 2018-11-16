import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { http } from 'common/api';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const itemsBaseUrl = 'https://127.0.0.1:5000/api/items';

describe('Items actions', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
    store.clearActions();
  });

  describe('Fetch item details tests', () => {
    let mock;
    let response = {};
    beforeEach(() => {
      mock = new MockAdapter(http);
      mock.onGet(`${itemsBaseUrl}/1`).reply(() => {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            resolve([200, JSON.stringify(response)]);
          }, 1000)
        );
      });
      mock.onGet(`${itemsBaseUrl}/2`).reply(() => {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            reject([500, 'Error']);
          }, 1000)
        );
      });
    });

    it('should dispatch an action when fetching an item', done => {
      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store
        .dispatch(actions.fetchItemDetails(`${itemsBaseUrl}/1/next`))
        .then(() => {
          let actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an action when item fetch succeeds', done => {
      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: response,
        },
      ];

      store.dispatch(actions.fetchItemDetails(1)).then(() => {
        let actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });

    it('should dispatch an action when item fetch fails', done => {
      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store.dispatch(actions.fetchItemDetails(2)).then(() => {
        let actions = store.getActions();
        expect(actions[1]).toEqual(expectedActions[0]);
        done();
      });
    });
  });
});
