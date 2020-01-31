import { DocumentTitle, DocumentAuthors } from '@components/Document';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SeriesSelectListEntry extends Component {
  render() {
    const { series, disabled, description } = this.props;
    return (
      <div
        key={series.metadata.pid}
        className={disabled ? 'select-disabled' : ''}
      >
        <div className="price">{series.metadata.mode_of_issuance} #{series.metadata.pid}</div>
        <div className="title">{series.metadata.title}</div>
        <div className="description">{description}</div>
      </div>
    );
  }
}

SeriesSelectListEntry.propTypes = {
  disabled: PropTypes.bool.isRequired,
  series: PropTypes.object.isRequired,
  description: PropTypes.node,
};

SeriesSelectListEntry.defaultProps = {
  disabled: false,
};
