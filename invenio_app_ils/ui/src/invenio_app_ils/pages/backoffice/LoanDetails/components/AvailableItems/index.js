import { connect } from 'react-redux';
import { assignItemAndCheckout, fetchAvailableItems } from './state/actions';
import { assignItemToLoan } from './state/actions';
import AvailableItemsComponent from './AvailableItems';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

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
  assignItemAndCheckout: (loanPid, loan, url, itemPid) =>
    dispatch(assignItemAndCheckout(loanPid, loan, url, itemPid)),
});

export const AvailableItems = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AvailableItemsComponent);
