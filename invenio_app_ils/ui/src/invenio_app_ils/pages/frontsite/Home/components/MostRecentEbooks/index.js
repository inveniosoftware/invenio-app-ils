import { connect } from 'react-redux';
import { fetchMostRecentEbooks } from './state/actions';
import MostRecentEbooksComponent from './MostRecentEbooks';

const mapStateToProps = state => ({
  data: state.mostRecentEbooks.data,
  error: state.mostRecentEbooks.error,
  isLoading: state.mostRecentEbooks.isLoading,
  hasError: state.mostRecentEbooks.hasError,
});

const mapDispatchToProps = dispatch => ({
  fetchMostRecentEbooks: () => dispatch(fetchMostRecentEbooks()),
});

export const MostRecentEbooks = connect(
  mapStateToProps,
  mapDispatchToProps
)(MostRecentEbooksComponent);
