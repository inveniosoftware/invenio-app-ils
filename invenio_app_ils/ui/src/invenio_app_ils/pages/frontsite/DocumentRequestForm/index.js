import { connect } from 'react-redux';
import { createDocumentRequest } from './state/actions';
import DocumentRequestFormComponent from './DocumentRequestForm';

const mapStateToProps = state => ({
  data: state.documentRequestForm.data,
  error: state.documentRequestForm.error,
  isLoading: state.documentRequestForm.isLoading,
  hasError: state.documentRequestForm.hasError,
});

const mapDispatchToProps = dispatch => ({
  createDocumentRequest: (data, actions) =>
    dispatch(createDocumentRequest(data, actions)),
});

export const DocumentRequestForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRequestFormComponent);
