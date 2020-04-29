import { connect } from 'react-redux';
import { fetchPatronPastLoans } from '@state/PatronPastLoans/actions';
import PatronPastLoansComponent from './PatronPastLoans';

const mapStateToProps = state => ({
  data: state.patronPastLoans.data,
  error: state.patronPastLoans.error,
  isLoading: state.patronPastLoans.isLoading,
  hasError: state.patronPastLoans.hasError,
  patronDetails: state.patronDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPastLoans: (patronPid, optionalParams = {}) =>
    dispatch(fetchPatronPastLoans(patronPid, optionalParams)),
});

export const PatronPastLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastLoansComponent);
