import { connect } from 'react-redux';

import { borrowingRequestPatronLoanCreate } from './state/actions';
import BorrowingRequestPatronLoanComponent from './BorrowingRequestPatronLoan';

const mapStateToProps = state => ({
  isLoading: state.borrowingRequestPatronLoanCreate.isLoading,
  error: state.borrowingRequestPatronLoanCreate.error,
  hasError: state.borrowingRequestPatronLoanCreate.hasError,
});

const mapDispatchToProps = dispatch => ({
  borrowingRequestPatronLoanCreate: (brwReqPid, loanStartDate, loanEndDate) =>
    dispatch(
      borrowingRequestPatronLoanCreate(brwReqPid, loanStartDate, loanEndDate)
    ),
});

export const BorrowingRequestPatronLoan = connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowingRequestPatronLoanComponent);
