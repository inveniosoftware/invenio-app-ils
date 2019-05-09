import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EItemDetailsComponent from './EItemDetails';

const mapStateToProps = state => ({
  isLoading: state.eitemDetails.isLoading,
  error: state.eitemDetails.error,
});

export const EItemDetails = compose(
  withRouter,
  connect(mapStateToProps)
)(EItemDetailsComponent);
