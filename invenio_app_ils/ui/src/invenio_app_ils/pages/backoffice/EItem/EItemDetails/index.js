import { connect } from 'react-redux';
import { fetchEItemDetails } from './state/actions';
import EItemDetailsComponent from './EItemDetails';

const mapStateToProps = state => ({
  isLoading: state.eitemDetails.isLoading,
  error: state.eitemDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchEItemDetails: eitemPid => dispatch(fetchEItemDetails(eitemPid)),
});

export const EItemDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(EItemDetailsComponent);
