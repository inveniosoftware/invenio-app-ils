import { connect } from 'react-redux';
import { fetchReferences } from './state/actions';
import DeleteRecordModalComponent from './DeleteRecordModal';

const mapStateToProps = state => ({
  data: state.deleteRecordModal.data,
  error: state.deleteRecordModal.error,
  isLoading: state.deleteRecordModal.isLoading,
  hasError: state.deleteRecordModal.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchReferences: promiseArray => dispatch(fetchReferences(promiseArray)),
});

export const DeleteRecordModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteRecordModalComponent);
