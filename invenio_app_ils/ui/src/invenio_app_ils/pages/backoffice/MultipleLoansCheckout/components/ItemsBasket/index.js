import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ItemsBasketComponent from './ItemsBasket';
import { basketCheckout, removeItemFromBasket } from './state/actions';

const mapDispatchToProps = dispatch => ({
  basketCheckout: (patronPid, items) =>
    dispatch(basketCheckout(patronPid, items)),
  removeItemFromBasket: item => dispatch(removeItemFromBasket(item)),
});

const mapStateToProps = state => ({
  isLoading: state.itemsBasket.isLoading,
  data: state.itemsBasket.data,
  basketItems: state.itemsBasket.basketItems,
  hasError: state.itemsBasket.hasError,
  patron: state.selectedUser.data,
});

export const ItemsBasket = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemsBasketComponent);
