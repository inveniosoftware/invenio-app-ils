import { connect } from 'react-redux';
import { fetchPatronPendingLoans } from '../../../../../common/state/PatronPendingLoans/actions';
import PatronPendingLoansComponent from './PatronPendingLoans';

const mapStateToProps = state => ({
  ...state.patronPendingLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPendingLoans: (patronPid, query) =>
    dispatch(fetchPatronPendingLoans(patronPid, query)),
});

export const PatronPendingLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPendingLoansComponent);
