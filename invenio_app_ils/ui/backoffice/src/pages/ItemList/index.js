import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemList } from './state/actions';
import itemListComponent from './ItemList';

const mapStateToProps = state => ({
  isLoading: state.itemList.isLoading,
  data: state.itemList.data,
  error: state.itemList.error,
});

const mapActions = dispatch => ({
  fetchItemList: () => dispatch(fetchItemList()),
});

export const ItemList = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapActions
  )
)(itemListComponent);
