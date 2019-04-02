import { connect } from 'react-redux';
import { fetchOverdueLoans } from './state/actions';
import OverdueLoansListComponent from './OverdueLoansList';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  data: state.overdueLoans.data,
  error: state.overdueLoans.error,
  isLoading: state.overdueLoans.isLoading,
  hasError: state.overdueLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchOverdueLoans: () => dispatch(fetchOverdueLoans()),
});

export const OverdueLoansList = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OverdueLoansListComponent);
