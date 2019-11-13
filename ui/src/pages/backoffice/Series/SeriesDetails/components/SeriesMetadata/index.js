import { connect } from 'react-redux';
import SeriesMetadataComponent from './SeriesMetadata';
import { deleteSeries } from '../../state/actions';

const mapStateToProps = state => ({
  seriesDetails: state.seriesDetails.data,
  relations: state.seriesRelations.data,
  error: state.seriesDetails.error,
});

const mapDispatchToProps = dispatch => ({
  deleteSeries: seriesPid => dispatch(deleteSeries(seriesPid)),
});

export const SeriesMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesMetadataComponent);
