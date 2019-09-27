import { connect } from 'react-redux';
import DocumentPanelComponent from './DocumentPanel';

const mapStateToProps = state => ({
  documentsDetails: state.documentsDetails.data,
});

export const DocumentPanel = connect(
  mapStateToProps,
  null
)(DocumentPanelComponent);
