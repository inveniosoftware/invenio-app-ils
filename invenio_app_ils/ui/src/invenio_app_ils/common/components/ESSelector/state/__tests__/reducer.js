import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('Add selection tests', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should update selections', () => {
    const action = {
      type: types.UPDATE_SELECTIONS,
      payload: [{ id: 1, title: 'test' }],
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      selections: [{ id: 1, title: 'test' }],
    });
  });

  it('should add a single selection', () => {
    const action1 = {
      type: types.ADD_SINGLE_SELECTION,
      payload: { id: 1, title: 'test' },
    };
    const action2 = {
      type: types.ADD_SINGLE_SELECTION,
      payload: { id: 2, title: 'hello' },
    };
    const step1 = reducer(initialState, action1);
    expect(step1).toEqual({
      ...initialState,
      selections: [{ id: 1, title: 'test' }],
    });
    expect(reducer(step1, action2)).toEqual({
      ...step1,
      selections: [{ id: 2, title: 'hello' }],
    });
  });

  it('should add multi-selection', () => {
    const action1 = {
      type: types.ADD_MULTI_SELECTION,
      payload: { id: 1, title: 'test' },
    };
    const action2 = {
      type: types.ADD_MULTI_SELECTION,
      payload: { id: 2, title: 'hello' },
    };
    const step1 = reducer(initialState, action1);
    expect(step1).toEqual({
      ...initialState,
      selections: [{ id: 1, title: 'test' }],
    });
    expect(reducer(step1, action2)).toEqual({
      ...step1,
      selections: [{ id: 1, title: 'test' }, { id: 2, title: 'hello' }],
    });
  });

  it('should remove selection', () => {
    const action1 = {
      type: types.ADD_SINGLE_SELECTION,
      payload: { id: 1, title: 'test' },
    };
    const action2 = {
      type: types.REMOVE_SELECTION,
      payload: { id: 1, title: 'hello' },
    };
    const step1 = reducer(initialState, action1);
    expect(step1).toEqual({
      ...initialState,
      selections: [{ id: 1, title: 'test' }],
    });
    expect(reducer(step1, action2)).toEqual({
      ...initialState,
      selections: [],
    });
  });
});
