import { connect } from 'react-redux';
import { fetchPatronPastLoans } from '@state/PatronPastLoans/actions';
import PatronPastLoansComponent from './PatronPastLoans';

const mapStateToProps = state => ({
  ...state.patronPastLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPastLoans: (patronPid, optionalParams = {}) =>
    dispatch(fetchPatronPastLoans(patronPid, optionalParams)),
});

export const PatronPastLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastLoansComponent);
