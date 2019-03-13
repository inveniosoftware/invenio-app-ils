import { connect } from 'react-redux';
import { fetchLocations } from './state/actions';
import LocationListComponent from './LocationList';

const mapStateToProps = state => ({
  data: state.locations.data,
  error: state.locations.error,
  isLoading: state.locations.isLoading,
  hasError: state.locations.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchLocations: () => dispatch(fetchLocations()),
});

export const LocationList = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationListComponent);
