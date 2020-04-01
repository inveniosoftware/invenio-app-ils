import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { LoanMetadata } from './components';

export default class LoanDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanDetails = this.props.fetchLoanDetails;
  }

  componentDidMount() {
    this.props.fetchLoanDetails(this.props.match.params.loanPid);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.loanPid !== this.props.match.params.loanPid) {
      this.props.fetchLoanDetails(this.props.match.params.loanPid);
    }
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Container>
              <LoanMetadata />
            </Container>
          </Error>
        </Loader>
      </Container>
    );
  }
}

LoanDetails.propTypes = {
  fetchLoanDetails: PropTypes.func.isRequired,
};
