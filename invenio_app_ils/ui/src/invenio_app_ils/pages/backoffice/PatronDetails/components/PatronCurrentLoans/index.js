import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPatronCurrentLoans } from './state/actions';
import PatronCurrentLoansComponent from './PatronCurrentLoans';

const mapStateToProps = state => ({
  data: state.patronCurrentLoans.data,
  error: state.patronCurrentLoans.error,
  isLoading: state.patronCurrentLoans.isLoading,
  hasError: state.patronCurrentLoans.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronCurrentLoans: patronPid =>
    dispatch(fetchPatronCurrentLoans(patronPid)),
});

export const PatronCurrentLoans = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PatronCurrentLoansComponent);
