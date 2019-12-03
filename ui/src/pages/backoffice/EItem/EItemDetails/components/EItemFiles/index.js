import { connect } from 'react-redux';

import EItemFilesComponent from './EItemFiles';
import { uploadFile, deleteFile } from '../../state/actions';
import { addNotification } from '@components/Notifications';

const mapStateToProps = state => ({
  eitemDetails: state.eitemDetails.data,
  files: state.eitemDetails.files,
  error: state.eitemDetails.error,
  isFilesLoading: state.eitemDetails.isFilesLoading,
});

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, message) =>
    dispatch(addNotification(title, message, 'error')),
  deleteFile: (bucket, filename) => dispatch(deleteFile(bucket, filename)),
  uploadFile: (eitemPid, bucket, file) =>
    dispatch(uploadFile(eitemPid, bucket, file)),
});

export const EItemFiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(EItemFilesComponent);
