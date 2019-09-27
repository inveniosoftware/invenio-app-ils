import { connect } from 'react-redux';
import DocumentMetadataComponent from './DocumentMetadata';
import { fetchDocumentsDetails } from '../../state/actions';

const mapStateToProps = state => ({
  documentsDetails: state.documentsDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: itemPid => dispatch(fetchDocumentsDetails(itemPid)),
});

export const DocumentMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentMetadataComponent);
