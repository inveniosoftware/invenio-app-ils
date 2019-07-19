import { connect } from 'react-redux';
import { fetchPatronCurrentLoans } from '../../../../../common/state/PatronCurrentLoans/actions';
import PatronCurrentLoansComponent from './PatronCurrentLoans';

const mapStateToProps = state => ({
  ...state.patronCurrentLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentLoans: (patronPid, page) =>
    dispatch(fetchPatronCurrentLoans(patronPid, page)),
});

export const PatronCurrentLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCurrentLoansComponent);
