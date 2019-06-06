import { connect } from 'react-redux';
import { fetchEItemDetails } from './state/actions';
import EItemDetailsContainerComponent from './EItemDetailsContainer';

const mapDispatchToProps = dispatch => ({
  fetchEItemDetails: eitemPid => dispatch(fetchEItemDetails(eitemPid)),
});

export const EItemDetailsContainer = connect(
  null,
  mapDispatchToProps
)(EItemDetailsContainerComponent);
