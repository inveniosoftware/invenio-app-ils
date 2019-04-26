import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DocumentsDetailsComponent from './DocumentsDetails';

const mapStateToProps = state => ({
  isLoading: state.documentsDetails.isLoading,
  data: state.documentsDetails.data,
  hasError: state.documentsDetails.hasError,
});

export const DocumentsDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(DocumentsDetailsComponent);
