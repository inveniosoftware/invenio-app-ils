import { connect } from 'react-redux';
import ItemDetails from './ItemDetails';
import { fetchItemDetails } from './state/actions';

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: itemid => dispatch(fetchItemDetails(itemid)),
});
export default connect(
  state => ({
    fetchLoading: state.itemDetails.fetchLoading,
    data: state.itemDetails.data,
    error: state.itemDetails.error,
  }),
  mapDispatchToProps
)(ItemDetails);
