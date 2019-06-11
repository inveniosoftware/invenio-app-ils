import { connect } from 'react-redux';
import DocumentsDetailsComponent from './DocumentsDetails';

const mapStateToProps = state => ({
  isLoading: state.documentsDetails.isLoading,
  data: state.documentsDetails.data,
  hasError: state.documentsDetails.hasError,
});

export const DocumentsDetails = connect(mapStateToProps)(
  DocumentsDetailsComponent
);
