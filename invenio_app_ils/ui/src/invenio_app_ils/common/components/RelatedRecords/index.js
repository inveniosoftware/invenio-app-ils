import { connect } from 'react-redux';

import { fetchRelatedRecords, updateRelatedRecords } from './state/actions';
import RelatedRecordsComponent from './RelatedRecords';

const mapStateToProps = state => ({
  data: state.relatedRecords.data,
  error: state.relatedRecords.error,
  isLoading: state.relatedRecords.isLoading,
  hasError: state.relatedRecords.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchRelatedRecords: (pid, pidType, size) =>
    dispatch(fetchRelatedRecords(pid, pidType, size)),
  updateRelatedRecords: (pid, pidType, data, size) =>
    dispatch(updateRelatedRecords(pid, pidType, data, size)),
});

export const RelatedRecords = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelatedRecordsComponent);
