import { connect } from 'react-redux';
import DocumentPanelComponent from './DocumentPanel';

const mapStateToProps = state => ({
  documentDetails: state.documentDetailsFront.data,
  isLoading: state.documentDetailsFront.isLoading,
});

export const DocumentPanel = connect(
  mapStateToProps,
  null
)(DocumentPanelComponent);
