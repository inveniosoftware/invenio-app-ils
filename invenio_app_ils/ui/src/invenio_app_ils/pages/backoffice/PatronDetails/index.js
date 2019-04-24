import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPatronDetails } from './state/actions';
import PatronDetailsContainerComponent from './PatronDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchPatronDetails: patronPid => dispatch(fetchPatronDetails(patronPid)),
});

export const PatronDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(PatronDetailsContainerComponent);
