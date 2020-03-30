import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class LoanDetailsLink extends Component {
  render() {
    const { loanPid, ...props } = this.props;
    return (
      <Link
        to={BackOfficeRoutes.loanDetailsFor(loanPid)}
        data-test={this.props.loanPid}
        {...props}
      >
        {this.props.children}
      </Link>
    );
  }
}

LoanDetailsLink.propTypes = {
  loanPid: PropTypes.string.isRequired,
};
