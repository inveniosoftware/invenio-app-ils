import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  BASKET_ADD_ITEM_SUCCESS,
  BASKET_ADD_ITEM_IS_LOADING,
  BASKET_ADD_ITEM_HAS_ERROR,
  BASKET_REMOVE_ITEM_IS_LOADING,
  BASKET_REMOVE_ITEM_SUCCESS,
  BASKET_REMOVE_ITEM_HAS_ERROR,
} from './types';
import { loan as loanApi } from '../../../../../../common/api';

export const basketCheckout = (userPid, items) => {
  return async (dispatch, getState) => {
    dispatch({
      type: IS_LOADING,
    });
    const stateUserSession = getState().userSession;
    await loanApi
      .multipleLoanCheckout(
        userPid,
        items,
        stateUserSession.userPid,
        stateUserSession.locationPid
      )
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: HAS_ERROR,
          payload: error,
        });
      });
  };
};

export const addItemToBasket = item => {
  return dispatch => {
    dispatch({
      type: BASKET_ADD_ITEM_IS_LOADING,
    });

    try {
      dispatch({
        type: BASKET_ADD_ITEM_SUCCESS,
        payload: item,
      });
    } catch (error) {
      dispatch({
        type: BASKET_ADD_ITEM_HAS_ERROR,
        payload: error,
      });
    }
  };
};

export const removeItemFromBasket = item => {
  return dispatch => {
    dispatch({
      type: BASKET_REMOVE_ITEM_IS_LOADING,
    });

    try {
      dispatch({
        type: BASKET_REMOVE_ITEM_SUCCESS,
        payload: item,
      });
    } catch (error) {
      dispatch({
        type: BASKET_REMOVE_ITEM_HAS_ERROR,
        payload: error,
      });
    }
  };
};
