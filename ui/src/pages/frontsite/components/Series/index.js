import { connect } from 'react-redux';
import { SeriesAccess as SeriesAccessComponent } from './SeriesAccess';
import { SeriesAccessUrls as SeriesAccessUrlsComponent } from './SeriesAccessUrls';
import { SeriesAllTitles as SeriesAllTitlesComponent } from './SeriesAllTitles';
import { SeriesAlternativeTitles as SeriesAlternativeTitlesComponent } from './SeriesAlternativeTitles';
import { SeriesInfo as SeriesInfoComponent } from './SeriesInfo';
import { SeriesLinks as SeriesLinksComponent } from './SeriesLinks';
import { SeriesMetadataAccordion as SeriesMetadataAccordionComponent } from './SeriesMetadataAccordion';
import { SeriesMetadataTabs as SeriesMetadataTabsComponent } from './SeriesMetadataTabs';
import { SeriesTitle as SeriesTitleComponent } from './SeriesTitle';
import { SeriesUrls as SeriesUrlsComponent } from './SeriesUrls';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
export { SeriesLiteratureSearch } from './SeriesLiteratureSearch';
export { SeriesCard } from './SeriesCard';

/**
 * Find volume number of a record.
 * @param {record} record - Record to find volume for
 * @param {pidObject} parentPid - Parent PID object that the record belongs to
 */
export const findVolume = (record, parentPid) => {
  if (isEmpty(parentPid)) {
    return null;
  }
  const serials = get(record, 'metadata.relations.serial', []);
  const parent = serials.find(
    relation => relation.pid === parentPid && relation.pid_type === 'serid'
  );
  return parent ? parent.volume : null;
};

const mapStateToProps = state => ({
  isLoading: state.seriesDetailsFront.isLoading,
  metadata: state.seriesDetailsFront.data.metadata,
  hasError: state.seriesDetailsFront.hasError,
  activeTab: state.seriesDetailsFront.activeTab,
});

export const SeriesAccess = connect(
  mapStateToProps,
  null
)(SeriesAccessComponent);

export const SeriesAccessUrls = connect(
  mapStateToProps,
  null
)(SeriesAccessUrlsComponent);

export const SeriesAllTitles = connect(
  mapStateToProps,
  null
)(SeriesAllTitlesComponent);

export const SeriesAlternativeTitles = connect(
  mapStateToProps,
  null
)(SeriesAlternativeTitlesComponent);

export const SeriesInfo = connect(
  mapStateToProps,
  null
)(SeriesInfoComponent);

export const SeriesLinks = connect(
  mapStateToProps,
  null
)(SeriesLinksComponent);

export const SeriesMetadataAccordion = connect(
  mapStateToProps,
  null
)(SeriesMetadataAccordionComponent);

export const SeriesMetadataTabs = connect(
  mapStateToProps,
  null
)(SeriesMetadataTabsComponent);

export const SeriesTitle = connect(
  mapStateToProps,
  null
)(SeriesTitleComponent);

export const SeriesUrls = connect(
  mapStateToProps,
  null
)(SeriesUrlsComponent);
