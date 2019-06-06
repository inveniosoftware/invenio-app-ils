import { connect } from 'react-redux';
import EItemDetailsComponent from './EItemDetails';

const mapStateToProps = state => ({
  isLoading: state.eitemDetails.isLoading,
  error: state.eitemDetails.error,
});

export const EItemDetails = connect(mapStateToProps)(EItemDetailsComponent);
