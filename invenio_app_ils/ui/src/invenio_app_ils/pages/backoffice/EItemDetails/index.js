import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchEItemDetails } from './state/actions';
import EItemDetailsContainerComponent from './EItemDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchEItemDetails: eitemPid => dispatch(fetchEItemDetails(eitemPid)),
});

export const EItemDetailsContainer = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(EItemDetailsContainerComponent);
