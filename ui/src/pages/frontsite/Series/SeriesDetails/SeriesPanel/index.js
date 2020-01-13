import { connect } from 'react-redux';
import SeriesPanelComponent from './SeriesPanel';
import SeriesPanelMobileComponent from './SeriesPanelMobile';

const mapStateToProps = state => ({
  series: state.seriesDetailsFront.data,
  isLoading: state.seriesDetailsFront.isLoading,
});

export const SeriesPanel = connect(
  mapStateToProps,
  null
)(SeriesPanelComponent);

export const SeriesPanelMobile = connect(
  mapStateToProps,
  null
)(SeriesPanelMobileComponent);
