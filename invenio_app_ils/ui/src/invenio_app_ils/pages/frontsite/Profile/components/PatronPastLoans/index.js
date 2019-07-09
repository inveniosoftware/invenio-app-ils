import { connect } from 'react-redux';
import { fetchPatronPastLoans } from '../../../../../common/state/PatronPastLoans/actions';
import PatronPastLoansComponent from './PatronPastLoans';

const mapStateToProps = state => ({
  ...state.patronPastLoans,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronPastLoans: (patronPid, query) =>
    dispatch(fetchPatronPastLoans(patronPid, query)),
});

export const PatronPastLoans = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronPastLoansComponent);
