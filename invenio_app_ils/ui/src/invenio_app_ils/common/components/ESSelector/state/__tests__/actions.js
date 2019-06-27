import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;
beforeEach(() => {});

describe('EsSelector actions', () => {
  it('should add a single selection', () => {
    const expectedAction1 = {
      type: types.UPDATE_SELECTIONS,
      payload: [{ id: 1, title: 'title1' }],
    };
    const expectedAction2 = {
      type: types.UPDATE_SELECTIONS,
      payload: [{ id: 2, title: 'title2' }],
    };
    const selection1 = { id: 1, title: 'title1' };
    const selection2 = { id: 2, title: 'title2' };

    store = mockStore({ esSelector: { selections: [selection1] } });
    store.clearActions();

    store.dispatch(actions.addSingleSelection(selection1));
    expect(store.getActions()[0]).toEqual(expectedAction1);

    store.dispatch(actions.addSingleSelection(selection2));
    expect(store.getActions()[1]).toEqual(expectedAction2);
  });

  it('should add multiple selections', () => {
    const expectedAction1 = {
      type: types.UPDATE_SELECTIONS,
      payload: [{ id: 1, title: 'title1' }],
    };
    const expectedAction2 = {
      type: types.UPDATE_SELECTIONS,
      payload: [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }],
    };
    const selection1 = { id: 1, title: 'title1' };
    const selection2 = { id: 2, title: 'title2' };

    store = mockStore({ esSelector: { selections: [] } });
    store.clearActions();

    store.dispatch(actions.addMultiSelection(selection1));
    expect(store.getActions()[0]).toEqual(expectedAction1);

    store = mockStore({ esSelector: { selections: [selection1] } });
    store.clearActions();

    store.dispatch(actions.addMultiSelection(selection2));
    expect(store.getActions()[0]).toEqual(expectedAction2);
  });

  it('should remove selection', () => {
    const expectedAction1 = {
      type: types.UPDATE_SELECTIONS,
      payload: [{ id: 2, title: 'title2' }],
    };
    const selection = { id: 1, title: 'title1' };

    store = mockStore({
      esSelector: {
        selections: [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }],
      },
    });
    store.clearActions();

    store.dispatch(actions.removeSelection(selection));
    expect(store.getActions()[0]).toEqual(expectedAction1);
  });
});
