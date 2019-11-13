import { connect } from 'react-redux';

import { fetchEItemDetails } from '../../EItemDetails/state/actions';
import { EItemEditor as EItemEditorComponent } from './EItemEditor';

const mapStateToProps = state => ({
  isLoading: state.eitemDetails.isLoading,
  data: state.eitemDetails.data,
  error: state.eitemDetails.error,
});

const mapDispatchToProps = dispatch => ({
  fetchEItemDetails: eitemPid => dispatch(fetchEItemDetails(eitemPid)),
});

export const EItemEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EItemEditorComponent);
