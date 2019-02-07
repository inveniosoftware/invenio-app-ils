import { connect } from 'react-redux';
import { fetchRenewedLoans } from './state/actions';
import RenewedLoansListComponent from './RenewedLoansList';

const mapStateToProps = state => ({
  data: state.latestRenewedLoans.data,
  isLoading: state.latestRenewedLoans.isLoading,
  hasError: state.latestRenewedLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchRenewedLoans: () => dispatch(fetchRenewedLoans()),
});

export const RenewedLoansList = connect(
  mapStateToProps,
  mapDispatchToProps
)(RenewedLoansListComponent);
