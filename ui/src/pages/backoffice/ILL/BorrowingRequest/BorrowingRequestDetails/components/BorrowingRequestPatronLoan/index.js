import { connect } from 'react-redux';

import { borrowingRequestCreateLoan } from './state/actions';
import BorrowingRequestPatronLoanComponent from './BorrowingRequestPatronLoan';

const mapStateToProps = state => ({
  isLoading: state.borrowingRequestCreateLoan.isLoading,
  error: state.borrowingRequestCreateLoan.error,
  hasError: state.borrowingRequestCreateLoan.hasError,
});

const mapDispatchToProps = dispatch => ({
  borrowingRequestCreateLoan: (brwReqPid, loanStartDate, loanEndDate) =>
    dispatch(borrowingRequestCreateLoan(brwReqPid, loanStartDate, loanEndDate)),
});

export const BorrowingRequestPatronLoan = connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowingRequestPatronLoanComponent);
