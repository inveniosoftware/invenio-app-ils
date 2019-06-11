import { connect } from 'react-redux';
import { fetchIdlePendingLoans } from './state/actions';
import IdleLoansListComponent from './IdleLoansList';

const mapStateToProps = state => ({
  data: state.idlePendingLoans.data,
  error: state.idlePendingLoans.error,
  isLoading: state.idlePendingLoans.isLoading,
  hasError: state.idlePendingLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchIdlePendingLoans: () => dispatch(fetchIdlePendingLoans()),
});

export const IdleLoansList = connect(
  mapStateToProps,
  mapDispatchToProps
)(IdleLoansListComponent);
