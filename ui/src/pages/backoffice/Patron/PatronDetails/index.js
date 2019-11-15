import { connect } from 'react-redux';
import { fetchPatronDetails } from './state/actions';
import PatronDetailsComponent from './PatronDetails';

const mapStateToProps = state => ({
  isLoading: state.patronDetails.isLoading,
  error: state.patronDetails.error,
  hasError: state.patronDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchPatronDetails: patronPid => dispatch(fetchPatronDetails(patronPid)),
});

export const PatronDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronDetailsComponent);
