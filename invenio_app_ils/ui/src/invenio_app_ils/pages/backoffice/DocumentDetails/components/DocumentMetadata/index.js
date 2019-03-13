import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DocumentMetadataComponent from './DocumentMetadata';
import { fetchDocumentDetails } from '../../state/actions';

const mapStateToProps = state => ({
  documentDetails: state.documentDetails.data,
  error: state.documentDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentDetails: itemPid => dispatch(fetchDocumentDetails(itemPid)),
});

export const DocumentMetadata = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentMetadataComponent);
