import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DocumentDetailsComponent from './DocumentDetails';

const mapStateToProps = state => ({
  isLoading: state.documentDetails.isLoading,
  data: state.documentDetails.data,
  error: state.documentDetails.error,
  hasError: state.documentDetails.hasError,
});

export const DocumentDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(DocumentDetailsComponent);
