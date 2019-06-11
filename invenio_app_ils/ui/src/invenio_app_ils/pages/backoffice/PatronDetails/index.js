import { connect } from 'react-redux';
import { fetchPatronDetails } from './state/actions';
import PatronDetailsContainerComponent from './PatronDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchPatronDetails: patronPid => dispatch(fetchPatronDetails(patronPid)),
});

export const PatronDetailsContainer = connect(
  null,
  mapDispatchToProps
)(PatronDetailsContainerComponent);
