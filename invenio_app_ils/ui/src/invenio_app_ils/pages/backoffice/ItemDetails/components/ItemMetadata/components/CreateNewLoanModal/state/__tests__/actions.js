import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../../../../../../../common/api';
import { sessionManager } from '../../../../../../../../../authentication/services';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockPost = jest.fn();
loanApi.postAction = mockPost;

const response = { data: {} };
const expectedPayload = {};

let store;
beforeEach(() => {
  mockPost.mockClear();

  store = mockStore({
    ...initialState,
    userSession: {
      userPid: '1',
      locationPid: '2',
    },
  });
  store.clearActions();
});

describe('Create new loan actions', () => {
  describe('Create a new loan tests', () => {
    it('should dispatch an action when creating a new loan for an item', done => {
      mockPost.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.IS_LOADING,
        },
      ];

      store
        .dispatch(
          actions.createNewLoanForItem('123', {
            metadata: {
              item_pid: '123',
              document_pid: '456',
              patron_pid: '789',
            },
          })
        )
        .then(() => {
          expect(mockPost).toHaveBeenCalledWith(
            '/circulation/loans/create',
            '123',
            {
              metadata: {
                item_pid: '123',
                document_pid: '456',
                patron_pid: '789',
              },
            },
            sessionManager.user.id,
            sessionManager.user.locationPid
          );
          const actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an action when create new loan succeeds', done => {
      mockPost.mockResolvedValue(response);

      const expectedActions = [
        {
          type: types.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store
        .dispatch(
          actions.createNewLoanForItem('123', {
            metadata: {
              item_pid: '123',
              document_pid: '456',
              patron_pid: '789',
            },
          })
        )
        .then(() => {
          expect(mockPost).toHaveBeenCalledWith(
            '/circulation/loans/create',
            '123',
            {
              metadata: {
                item_pid: '123',
                document_pid: '456',
                patron_pid: '789',
              },
            },
            sessionManager.user.id,
            sessionManager.user.locationPid
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an action when item fetch fails', done => {
      mockPost.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: types.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store
        .dispatch(
          actions.createNewLoanForItem('456', {
            metadata: {
              item_pid: '123',
              document_pid: '456',
              patron_pid: '789',
            },
          })
        )
        .then(() => {
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });
  });
});
