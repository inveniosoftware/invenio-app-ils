import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DocumentMetadataComponent from './DocumentMetadata';
import { fetchDocumentsDetails } from '../../state/actions';

const mapStateToProps = state => ({
  documentsDetails: state.documentsDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentsDetails: itemPid => dispatch(fetchDocumentsDetails(itemPid)),
});

export const DocumentMetadata = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DocumentMetadataComponent);
