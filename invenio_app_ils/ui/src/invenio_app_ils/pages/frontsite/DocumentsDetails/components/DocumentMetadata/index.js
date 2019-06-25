import { connect } from 'react-redux';
import DocumentMetadataComponent from './DocumentMetadata';
import {
  fetchDocumentsDetails,
  requestLoanForDocument,
} from '../../state/actions';

const mapStateToProps = state => ({
  documentsDetails: state.documentsDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: itemPid => dispatch(fetchDocumentsDetails(itemPid)),
  requestLoanForDocument: (docPid, url) =>
    dispatch(requestLoanForDocument(docPid, url)),
});

export const DocumentMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentMetadataComponent);
