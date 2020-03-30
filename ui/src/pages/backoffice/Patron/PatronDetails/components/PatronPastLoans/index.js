import { connect } from 'react-redux';
import { fetchPatronPastLoans } from '@state/PatronPastLoans/actions';
import PatronPastLoansComponent from './PatronPastLoans';

const mapStateToProps = state => ({
  data: state.patronCurrentLoans.data,
  error: state.patronCurrentLoans.error,
  isLoading: state.patronCurrentLoans.isLoading,
  hasError: state.patronCurrentLoans.hasError,
  patronDetails: state.patronDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPastLoans: (patronPid, page) =>
    dispatch(fetchPatronPastLoans(patronPid, page)),
});

export const PatronPastLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastLoansComponent);
