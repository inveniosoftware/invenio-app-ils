import { SearchEmptyResults } from '@components/SearchControls';
import { DocumentIcon } from '@pages/backoffice';
import { SeriesListEntry } from './SeriesListEntry';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, List } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import _isEmpty from 'lodash/isEmpty';
import { DocumentLanguages, DocumentTags } from '@components/Document';
import { SeriesAuthors } from '@components';

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
