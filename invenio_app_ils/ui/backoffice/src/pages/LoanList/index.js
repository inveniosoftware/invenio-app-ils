import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLoanList } from './state/actions';
import loanListContainerComponent from './LoanListContainer';

const mapStateToProps = state => ({
  isLoading: state.loanList.isLoading,
  data: state.loanList.data,
  error: state.loanList.error,
});

const mapDispatchToProps = dispatch => ({
  fetchLoanList: () => dispatch(fetchLoanList()),
});

export const LoanListContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(loanListContainerComponent);
