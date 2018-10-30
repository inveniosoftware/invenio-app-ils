import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanList } from './state/actions';
import loanListComponent from './LoanList';

const mapStateToProps = state => ({
  isLoading: state.loanList.isLoading,
  data: state.loanList.data,
  error: state.loanList.error,
});

const mapActions = dispatch => ({
  fetchLoanList: () => dispatch(fetchLoanList()),
});

export const LoanList = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapActions
  )
)(loanListComponent);
