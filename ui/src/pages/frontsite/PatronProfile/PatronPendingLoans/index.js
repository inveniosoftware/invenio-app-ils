import { connect } from 'react-redux';
import { fetchPatronPendingLoans } from '../../../../common/state/PatronPendingLoans/actions';
import PatronPendingLoansComponent from './PatronPendingLoans';

const mapStateToProps = state => ({
  ...state.patronPendingLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPendingLoans: (patronPid, page, size) =>
    dispatch(fetchPatronPendingLoans(patronPid, page, size)),
});

export const PatronPendingLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPendingLoansComponent);
