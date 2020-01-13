import { connect } from 'react-redux';
import SeriesMetadataComponent from './SeriesMetadata';
import { fetchSeriesDetails } from '../state/actions';

const mapStateToProps = state => ({
  series: state.seriesDetailsFront.data,
});

const mapDispatchToProps = dispatch => ({
  fetchSeriesDetails: itemPid => dispatch(fetchSeriesDetails(itemPid)),
});

export const SeriesMetadata = connect(
  mapStateToProps,
  mapDispatchToProps
)(SeriesMetadataComponent);
