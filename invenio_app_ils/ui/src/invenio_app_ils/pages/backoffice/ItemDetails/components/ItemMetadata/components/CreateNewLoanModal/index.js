import { connect } from 'react-redux';
import { createNewLoanForItem, resetNewLoanState } from './state/actions';
import CreateNewLoanModalComponent from './CreateNewLoanModal';

const mapStateToProps = state => ({
  isLoading: state.itemDetails.newLoanCreate.isLoading,
  data: state.itemDetails.newLoanCreate.data,
  error: state.itemDetails.newLoanCreate.error,
  hasError: state.itemDetails.newLoanCreate.hasError,
});
const mapDispatchToProps = dispatch => ({
  createNewLoanForItem: (pid, loan, url) =>
    dispatch(createNewLoanForItem(pid, loan, url)),
  resetNewLoanState: () => dispatch(resetNewLoanState()),
});

export const CreateNewLoanModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewLoanModalComponent);
