import { connect } from 'react-redux';

import { deleteEItem } from '../../state/actions';
import EItemActionMenuComponent from './EItemActionMenu';

const mapStateToProps = state => ({
  isLoading: state.eitemDetails.isLoading,
  error: state.eitemDetails.error,
  eitem: state.eitemDetails.data,
});

const mapDispatchToProps = dispatch => ({
  deleteEItem: itemPid => dispatch(deleteEItem(itemPid)),
});

export const EItemActionMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(EItemActionMenuComponent);
