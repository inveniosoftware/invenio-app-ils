import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { item as itemApi } from '../../../../../common/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockGet = jest.fn();
const mockDelete = jest.fn();
itemApi.get = mockGet;
itemApi.delete = mockDelete;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockGet.mockClear();
  mockDelete.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('Fetch item details tests', () => {
  it('should dispatch an action when fetching an item', async () => {
    mockGet.mockResolvedValue(response);

    const expectedAction = {
      type: types.IS_LOADING,
    };

    store.dispatch(actions.fetchItemDetails('123'));
    expect(mockGet).toHaveBeenCalledWith('123');
    expect(store.getActions()[0]).toEqual(expectedAction);
  });

  it('should dispatch an action when item fetch succeeds', async () => {
    mockGet.mockResolvedValue(response);

    const expectedAction = {
      type: types.SUCCESS,
      payload: expectedPayload,
    };

    await store.dispatch(actions.fetchItemDetails('123'));
    expect(mockGet).toHaveBeenCalledWith('123');
    expect(store.getActions()[1]).toEqual(expectedAction);
  });

  it('should dispatch an action when item fetch fails', async () => {
    mockGet.mockRejectedValue([500, 'Error']);

    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    await store.dispatch(actions.fetchItemDetails('456'));
    expect(mockGet).toHaveBeenCalledWith('456');
    expect(store.getActions()[1]).toEqual(expectedAction);
  });
});

describe('Delete item tests', () => {
  it('should dispatch an action when trigger delete item', async () => {
    const expectedAction = {
      type: types.DELETE_IS_LOADING,
    };

    store.dispatch(actions.deleteItem(1));
    expect(mockDelete).toHaveBeenCalled();
    expect(store.getActions()[0]).toEqual(expectedAction);
  });

  it('should dispatch a success action when item delete succeeds', async () => {
    jest.useFakeTimers();
    mockDelete.mockResolvedValue({ data: { itemPid: 1 } });
    const expectedAction = {
      type: types.DELETE_SUCCESS,
      payload: { itemPid: 1 },
    };

    await store.dispatch(actions.deleteItem(1));
    jest.runAllTimers();
    expect(mockDelete).toHaveBeenCalled();
    expect(store.getActions()[1]).toEqual(expectedAction);
  });

  it('should dispatch an action when item delete has error', async () => {
    const error = {
      error: { status: 500, message: 'error' },
    };
    mockDelete.mockRejectedValue(error);

    const expectedAction = {
      type: types.DELETE_HAS_ERROR,
      payload: error,
    };

    await store.dispatch(actions.deleteItem(1));
    expect(mockDelete).toHaveBeenCalled();
    expect(store.getActions()[1]).toEqual(expectedAction);
  });
});
