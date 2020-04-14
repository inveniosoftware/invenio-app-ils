import { connect } from 'react-redux';
import { fetchPatronCurrentLoans } from '@state/PatronCurrentLoans/actions';
import PatronCurrentLoansComponent from './PatronCurrentLoans';

const mapStateToProps = state => ({
  data: state.patronCurrentLoans.data,
  error: state.patronCurrentLoans.error,
  isLoading: state.patronCurrentLoans.isLoading,
  hasError: state.patronCurrentLoans.hasError,
  patronDetails: state.patronDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentLoans: (patronPid, optionalParams = {}) =>
    dispatch(fetchPatronCurrentLoans(patronPid, optionalParams)),
});

export const PatronCurrentLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentLoansComponent);
