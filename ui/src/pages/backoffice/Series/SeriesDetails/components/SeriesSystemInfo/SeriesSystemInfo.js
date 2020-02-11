import { toShortDateTime } from '@api/date';
import { MetadataTable } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SeriesSystemInfo extends Component {
  prepareData = () => {
    const { series } = this.props;
    let rows = [
      {
        name: 'Created',
        value: toShortDateTime(series.created),
      },
      {
        name: 'Last updated',
        value: toShortDateTime(series.updated),
      },
    ];

    return rows;
  };

  render() {
    return <MetadataTable rows={this.prepareData()} />;
  }
}

SeriesSystemInfo.propTypes = {
  series: PropTypes.object.isRequired,
};
