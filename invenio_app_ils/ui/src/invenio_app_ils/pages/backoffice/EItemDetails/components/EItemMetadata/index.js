import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EItemMetadataComponent from './EItemMetadata';
import { fetchEItemDetails } from '../../state/actions';

const mapStateToProps = state => ({
  error: state.eitemDetails.error,
  eitem: state.eitemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  fetchItemDetails: eitemPid => dispatch(fetchEItemDetails(eitemPid)),
});

export const EItemMetadata = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EItemMetadataComponent);
