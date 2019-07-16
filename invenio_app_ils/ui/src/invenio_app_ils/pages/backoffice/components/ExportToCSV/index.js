import { connect } from 'react-redux';
import { downloadCSV, fetchCount, navigateRecords } from './state/actions';
import ExportToCSVComponent from './ExportToCSV';

const mapStateToProps = state => ({
  data: state.csvExport.data,
  error: state.csvExport.error,
  isLoading: state.csvExport.isLoading,
  hasError: state.csvExport.hasError,
  recordsFrom: state.csvExport.recordsFrom,
  recordsTo: state.csvExport.recordsTo,
  totalRecords: state.csvExport.totalRecords,
  dlSize: state.csvExport.dlSize,
  csvIsLoading: state.csvExport.csvIsLoading,
  csvHasError: state.csvExport.csvHasError,
  csvData: state.csvExport.csvData,
  csvError: state.csvExport.csvError,
});

const mapDispatchToProps = dispatch => ({
  fetchCount: (query, countQuery) => dispatch(fetchCount(query, countQuery)),
  navigateRecords: navigation => dispatch(navigateRecords(navigation)),
  downloadCSV: (exportQuery, queryState) =>
    dispatch(downloadCSV(exportQuery, queryState)),
});

export const ExportToCSV = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportToCSVComponent);
