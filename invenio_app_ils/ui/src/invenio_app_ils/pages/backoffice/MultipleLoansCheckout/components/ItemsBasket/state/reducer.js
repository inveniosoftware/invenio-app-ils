import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  BASKET_ADD_ITEM_HAS_ERROR,
  BASKET_ADD_ITEM_IS_LOADING,
  BASKET_ADD_ITEM_SUCCESS,
  BASKET_REMOVE_ITEM_IS_LOADING,
  BASKET_REMOVE_ITEM_HAS_ERROR,
  BASKET_REMOVE_ITEM_SUCCESS,
} from './types';

export const initialState = {
  isLoading: false,
  hasError: false,
  data: {},
  basketItems: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: true, data: {} };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: false,
        basketItems: [],
      };
    case HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: true,
        basketItems: [],
      };
    case BASKET_ADD_ITEM_IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case BASKET_ADD_ITEM_HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: true,
      };
    case BASKET_ADD_ITEM_SUCCESS:
      let _basketItems = state.basketItems;
      _basketItems.push(action.payload);
      return {
        ...state,
        isLoading: false,
        data: {},
        basketItems: _basketItems,
        hasError: false,
      };
    case BASKET_REMOVE_ITEM_IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case BASKET_REMOVE_ITEM_HAS_ERROR:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        hasError: true,
      };
    case BASKET_REMOVE_ITEM_SUCCESS:
      let _currentBasketItems = state.basketItems;
      _currentBasketItems.splice(
        _currentBasketItems.findIndex(
          el => el.barcode === action.payload.barcode
        )
      );
      return {
        ...state,
        isLoading: false,
        data: {},
        basketItems: _currentBasketItems,
        hasError: false,
      };
    default:
      return state;
  }
};
