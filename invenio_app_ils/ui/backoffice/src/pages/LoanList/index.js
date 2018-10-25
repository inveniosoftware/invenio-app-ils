import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanList } from './state/actions';
import loanListComponent from './LoanList';

const mapDispatchToProps = dispatch => ({
  fetchLoanList: () => dispatch(fetchLoanList()),
});

export const LoanList = connect(
  state => ({
    isLoading: state.loanList.isLoading,
    data: state.loanList.data,
    error: state.loanList.error,
  }),
  mapDispatchToProps
)(withRouter(loanListComponent));
