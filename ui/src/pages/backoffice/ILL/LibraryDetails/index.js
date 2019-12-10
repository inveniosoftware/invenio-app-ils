import { connect } from 'react-redux';

import { deleteLibrary, fetchLibraryDetails } from './state/actions';
import LibraryDetailsComponent from './LibraryDetails';

const mapStateToProps = state => ({
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
