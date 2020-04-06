import { connect } from 'react-redux';

import { fetchLibraryDetails, deleteLibrary } from './state/actions';
import LibraryDetailsComponent from './LibraryDetails';

const mapStateToProps = state => ({
  data: state.libraryDetails.data,
  isLoading: state.libraryDetails.isLoading,
  error: state.libraryDetails.error,
  hasError: state.libraryDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchLibraryDetails: libraryPid => dispatch(fetchLibraryDetails(libraryPid)),
  deleteLibrary: libraryPid => dispatch(deleteLibrary(libraryPid)),
});

export const LibraryDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryDetailsComponent);
