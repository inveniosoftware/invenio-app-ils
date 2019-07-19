import { connect } from 'react-redux';
import { fetchPatronPastLoans } from '../../../../../common/state/PatronPastLoans/actions';
import PatronPastLoansComponent from './PatronPastLoans';

const mapStateToProps = state => ({
  ...state.patronPastLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPastLoans: (patronPid, page) =>
    dispatch(fetchPatronPastLoans(patronPid, page)),
});

export const PatronPastLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastLoansComponent);
