import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemList } from './state/actions';
import ItemListContainerComponent from './ItemListContainer';

const mapStateToProps = state => ({
  isLoading: state.itemList.isLoading,
  data: state.itemList.data,
  error: state.itemList.error,
});

const mapDispatchToProps = dispatch => ({
  fetchItemList: () => dispatch(fetchItemList()),
});

export const ItemListContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ItemListContainerComponent);
