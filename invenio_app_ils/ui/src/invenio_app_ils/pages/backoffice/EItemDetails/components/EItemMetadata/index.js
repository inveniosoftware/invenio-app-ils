import { connect } from 'react-redux';
import EItemMetadataComponent from './EItemMetadata';
import { deleteEItem } from '../../state/actions';

const mapStateToProps = state => ({
  error: state.eitemDetails.error,
  eitem: state.eitemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  deleteEItem: eitemPid => dispatch(deleteEItem(eitemPid)),
});

export const EItemMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(EItemMetadataComponent);
