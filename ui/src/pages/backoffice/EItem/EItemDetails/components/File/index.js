import { addNotification } from '@components/Notifications';
import { connect } from 'react-redux';
import { uploadFile } from './state/actions';

import UploadButtonComponent from './UploadButton';

const mapStateToProps = state => ({
  isFilesLoading: state.eitemDetails.isFilesLoading,
  files: state.eitemDetails.files,
  eitem: state.eitemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  sendErrorNotification: (title, message) =>
    dispatch(addNotification(title, message, 'error')),
  uploadFile: (eitemPid, bucket, file) =>
    dispatch(uploadFile(eitemPid, bucket, file)),
});

export const UploadButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadButtonComponent);
