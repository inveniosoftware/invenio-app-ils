import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class SeriesDetailsLink extends Component {
  render() {
    const { pidValue, ...uiProps } = this.props;
    return (
      <Link
        to={BackOfficeRoutes.seriesDetailsFor(pidValue)}
        data-test={pidValue}
        {...uiProps}
      >
        {this.props.children}
      </Link>
    );
  }
}

SeriesDetailsLink.propTypes = {
  pidValue: PropTypes.string.isRequired,
};
