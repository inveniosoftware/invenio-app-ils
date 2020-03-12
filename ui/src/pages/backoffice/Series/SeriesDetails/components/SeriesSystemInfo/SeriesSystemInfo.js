import { toShortDateTime } from '@api/date';
import { MetadataTable } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

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

    const created_by_type = _get(series, 'metadata.created_by.type');
    const created_by_value = _get(series, 'metadata.created_by.value', '-');
    const created_by = created_by_type
      ? `${created_by_type}: ${created_by_value}`
      : `${created_by_value}`;
    rows.push({
      name: 'Created by',
      value: `${created_by}`,
    });

    const updated_by_type = _get(series, 'metadata.updated_by.type');
    const updated_by_value = _get(series, 'metadata.updated_by.value', '-');
    const updated_by = updated_by_type
      ? `${updated_by_type}: ${updated_by_value}`
      : `${updated_by_value}`;
    rows.push({
      name: 'Updated by',
      value: `${updated_by}`,
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
