import { connect } from 'react-redux';
import { fetchPatronCurrentLoans } from '@state/PatronCurrentLoans/actions';
import PatronCurrentLoansComponent from './PatronCurrentLoans';

const mapStateToProps = state => ({
  data: state.patronCurrentLoans.data,
  error: state.patronCurrentLoans.error,
  isLoading: state.patronCurrentLoans.isLoading,
  hasError: state.patronCurrentLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentLoans: (patronPid, page) =>
    dispatch(fetchPatronCurrentLoans(patronPid, page)),
});

export const PatronCurrentLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentLoansComponent);
