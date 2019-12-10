import { connect } from 'react-redux';

import { fetchVendorDetails } from './state/actions';
import VendorDetailsComponent from './VendorDetails';

const mapStateToProps = state => ({
  data: state.vendorDetails.data,
  isLoading: state.vendorDetails.isLoading,
  error: state.vendorDetails.error,
  hasError: state.vendorDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchVendorDetails: vendorPid => dispatch(fetchVendorDetails(vendorPid)),
});

export const VendorDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorDetailsComponent);
