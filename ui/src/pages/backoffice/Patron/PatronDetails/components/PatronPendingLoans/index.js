import { connect } from 'react-redux';
import { fetchPatronPendingLoans } from '@state/PatronPendingLoans/actions';
import PatronPendingLoansComponent from './PatronPendingLoans';

const mapStateToProps = state => ({
  patronDetails: state.patronDetails.data,
  ...state.patronPendingLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPendingLoans: (patronPid, page) =>
    dispatch(fetchPatronPendingLoans(patronPid, page)),
});

export const PatronPendingLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPendingLoansComponent);
