import { recordToPidType } from '@api/utils';
import SeriesCard from './SeriesCard';
import { DocumentCard } from './DocumentCard';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RelationCard extends Component {
  render() {
    const { data, extra, actions } = this.props;
    return recordToPidType(data) === 'docid' ? (
      <DocumentCard data={data} extra={extra} actions={actions} />
    ) : (
      <SeriesCard data={data} extra={extra} actions={actions} />
    );
  }
}

RelationCard.propTypes = {
  data: PropTypes.object.isRequired,
  icon: PropTypes.node,
  extra: PropTypes.node,
};
