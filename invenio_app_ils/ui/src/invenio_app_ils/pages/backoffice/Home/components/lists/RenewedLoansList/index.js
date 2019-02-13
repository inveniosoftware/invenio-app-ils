import { connect } from 'react-redux';
import { fetchRenewedLoans } from './state/actions';
import RenewedLoansListComponent from './RenewedLoansList';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
  data: state.latestRenewedLoans.data,
  isLoading: state.latestRenewedLoans.isLoading,
  hasError: state.latestRenewedLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchRenewedLoans: () => dispatch(fetchRenewedLoans()),
});

export const RenewedLoansList = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RenewedLoansListComponent);
