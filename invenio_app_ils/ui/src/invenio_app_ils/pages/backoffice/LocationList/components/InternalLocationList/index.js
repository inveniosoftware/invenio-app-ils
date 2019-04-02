import { connect } from 'react-redux';
import { fetchInternalLocations } from './state/actions';
import InternalLocationListComponent from './InternalLocationList';

const mapStateToProps = state => ({
  data: state.internalLocations.data,
  error: state.internalLocations.error,
  isLoading: state.internalLocations.isLoading,
  hasError: state.internalLocations.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchInternalLocations: () => dispatch(fetchInternalLocations()),
});

export const InternalLocationList = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalLocationListComponent);
