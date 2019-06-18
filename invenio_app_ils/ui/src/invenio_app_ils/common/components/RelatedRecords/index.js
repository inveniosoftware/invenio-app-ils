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
  fetchRelatedRecords: (pid, pidType) =>
    dispatch(fetchRelatedRecords(pid, pidType)),
  updateRelatedRecords: (pid, pidType, data) =>
    dispatch(updateRelatedRecords(pid, pidType, data)),
});

export const RelatedRecords = connect(
  mapStateToProps,
  mapDispatchToProps
)(RelatedRecordsComponent);
