import { connect } from 'react-redux';
import { fetchOverdueLoans } from './state/actions';
import OverdueLoansListComponent from './OverdueLoansList';

const mapStateToProps = state => ({
  data: state.overdueLoans.data,
  error: state.overdueLoans.error,
  isLoading: state.overdueLoans.isLoading,
  hasError: state.overdueLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchOverdueLoans: () => dispatch(fetchOverdueLoans()),
});

export const OverdueLoansList = connect(
  mapStateToProps,
  mapDispatchToProps
)(OverdueLoansListComponent);
