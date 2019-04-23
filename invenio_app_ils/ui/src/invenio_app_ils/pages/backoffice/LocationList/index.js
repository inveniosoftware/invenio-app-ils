import { connect } from 'react-redux';
import { fetchLocations, deleteLocation } from './state/actions';
import LocationListComponent from './LocationList';

const mapStateToProps = state => ({
  data: state.locations.data,
  error: state.locations.error,
  isLoading: state.locations.isLoading,
  hasError: state.locations.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchLocations: () => dispatch(fetchLocations()),
  deleteLocation: locationId => dispatch(deleteLocation(locationId)),
});

export const LocationList = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationListComponent);
