import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export class SeriesViewDetailsLink extends Component {
  render() {
    const { seriesPid, ...uiProps } = this.props;
    return (
      <Link
        to={BackOfficeRoutes.seriesDetailsFor(this.props.seriesPid)}
        {...uiProps}
      >
        {this.props.children}
      </Link>
    );
  }
}

SeriesViewDetailsLink.propTypes = {
  seriesPid: PropTypes.string.isRequired,
};
