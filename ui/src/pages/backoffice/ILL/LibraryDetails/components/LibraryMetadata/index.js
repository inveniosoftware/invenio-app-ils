import { connect } from 'react-redux';

import LibraryMetadataComponent from './LibraryMetadata';
import { fetchLibraryDetails, deleteLibrary } from '../../state/actions';

const mapStateToProps = state => ({
  libraryDetails: state.libraryDetails.data,
  error: state.libraryDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchLibraryDetails: libraryPid => dispatch(fetchLibraryDetails(libraryPid)),
  deleteLibrary: libraryPid => dispatch(deleteLibrary(libraryPid)),
});

export const LibraryMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryMetadataComponent);
