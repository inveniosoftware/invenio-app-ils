import { connect } from 'react-redux';

import EItemFilesComponent from './EItemFiles';
import { uploadFile, deleteFile } from '../../state/actions';
import { addNotification } from '@components/Notifications';

const mapStateToProps = state => ({
  eitemDetails: state.eitemDetails.data,
  files: state.eitemDetails.files,
  error: state.eitemDetails.error,
  isLoading: state.eitemDetails.isLoading,
  isFilesLoading: state.eitemDetails.isFilesLoading,
  hasError: state.eitemDetails.hasError,
});

const mapDispatchToProps = dispatch => ({
  addNotification: (title, message, type) =>
    dispatch(addNotification(title, message, type)),
  deleteFile: (bucket, filename) => dispatch(deleteFile(bucket, filename)),
  uploadFile: (eitemPid, bucket, file) =>
    dispatch(uploadFile(eitemPid, bucket, file)),
});

export const EItemFiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(EItemFilesComponent);
