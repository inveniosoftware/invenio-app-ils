import { connect } from 'react-redux';
import { fetchAvailableItems } from './state/actions';
import { assignItemToLoan } from './state/actions';
import AvailableItemsComponent from './AvailableItems';

const mapStateToProps = state => ({
  data: state.availableItems.data,
  error: state.availableItems.error,
  isLoading: state.availableItems.isLoading,
  hasError: state.availableItems.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchAvailableItems: documentPid =>
    dispatch(fetchAvailableItems(documentPid)),
  assignItemToLoan: (itemPid, loanPid) =>
    dispatch(assignItemToLoan(itemPid, loanPid)),
});

export const AvailableItems = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableItemsComponent);
