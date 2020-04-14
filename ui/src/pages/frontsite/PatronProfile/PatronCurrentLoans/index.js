import { connect } from 'react-redux';
import { fetchPatronCurrentLoans } from '@state/PatronCurrentLoans/actions';
import PatronCurrentLoansComponent from './PatronCurrentLoans';

const mapStateToProps = state => ({
  ...state.patronCurrentLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentLoans: (patronPid, optionalParams = {}) =>
    dispatch(fetchPatronCurrentLoans(patronPid, optionalParams)),
});

export const PatronCurrentLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentLoansComponent);
