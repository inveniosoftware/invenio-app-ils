import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class SeriesDetailsLink extends Component {
  render() {
    const { seriesPid, ...uiProps } = this.props;
    return (
      <Link
        to={BackOfficeRoutes.seriesDetailsFor(this.props.seriesPid)}
        data-test={seriesPid}
        {...uiProps}
      >
        {this.props.children}
      </Link>
    );
  }
}

SeriesDetailsLink.propTypes = {
  seriesPid: PropTypes.string.isRequired,
};
