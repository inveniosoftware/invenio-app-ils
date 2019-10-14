import { connect } from 'react-redux';
import DocumentPanelComponent from './DocumentPanel';
import DocumentPanelMobileComponent from './DocumentPanelMobile';

const mapStateToProps = state => ({
  documentDetails: state.documentDetailsFront.data,
  isLoading: state.documentDetailsFront.isLoading,
});

export const DocumentPanel = connect(
  mapStateToProps,
  null
)(DocumentPanelComponent);

export const DocumentPanelMobile = connect(
  mapStateToProps,
  null
)(DocumentPanelMobileComponent);
