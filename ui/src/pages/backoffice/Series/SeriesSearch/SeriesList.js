import { SearchEmptyResults } from '@components/SearchControls';
import { SeriesListEntry } from './SeriesListEntry';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';

SeriesListEntry.propTypes = {
  series: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};

export default class SeriesList extends Component {
  renderListEntry = series => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(series);
    }
    return <SeriesListEntry key={series.metadata.pid} series={series} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length) return <SearchEmptyResults />;

    return (
      <Item.Group divided className={'bo-series-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}
