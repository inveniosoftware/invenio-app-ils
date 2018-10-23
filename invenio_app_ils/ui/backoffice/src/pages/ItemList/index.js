// export { ItemList } from './ItemList';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchItemList } from './state/actions';
import itemListComponent from './ItemList';

const mapDispatchToProps = dispatch => ({
  fetchItemList: () => dispatch(fetchItemList()),
});

export const ItemList = connect(
  state => ({
    isLoading: state.itemList.isLoading,
    data: state.itemList.data,
    error: state.itemList.error,
  }),
  mapDispatchToProps
)(withRouter(itemListComponent));
