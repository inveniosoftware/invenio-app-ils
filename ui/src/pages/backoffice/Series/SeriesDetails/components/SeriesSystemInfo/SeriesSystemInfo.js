import { toShortDateTime } from '@api/date';
import { CreatedBy, UpdatedBy } from '@components';
import { MetadataTable } from '@pages/backoffice/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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

    rows.push({
      name: 'Created by',
      value: <CreatedBy metadata={series.metadata} />,
    });

    rows.push({
      name: 'Updated by',
      value: <UpdatedBy metadata={series.metadata} />,
    });

    return rows;
  };

  render() {
    return <MetadataTable rows={this.prepareData()} />;
  }
}

SeriesSystemInfo.propTypes = {
  series: PropTypes.object.isRequired,
};
