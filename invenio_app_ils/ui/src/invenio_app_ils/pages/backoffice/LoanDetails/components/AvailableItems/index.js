import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchAvailableItems } from './state/actions';
import { assignItemToLoan } from '../../state/actions';
import AvailableItemsComponent from './AvailableItems';

const mapStateToProps = state => ({
  data: state.availableItems.data,
  isLoading: state.availableItems.isLoading,
  hasError: state.availableItems.hasError,
  currentSortBy: state.availableItems.sortBy,
  currentSortOrder: state.availableItems.sortOrder,
});

const mapDispatchToProps = dispatch => ({
  fetchAvailableItems: documentPid =>
    dispatch(fetchAvailableItems(documentPid)),
  assignItemToLoan: (itemPid, loanPid) =>
    dispatch(assignItemToLoan(itemPid, loanPid)),
});

export const AvailableItems = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AvailableItemsComponent);
