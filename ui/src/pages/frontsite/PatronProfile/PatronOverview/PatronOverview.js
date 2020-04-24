import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Statistic } from 'semantic-ui-react';

export default class PatronOverview extends Component {
  render() {
    const loansCount = this.props.currentLoans.data.total || 0;
    const loansTextPlural = loansCount !== 1;

    const loanRequestsCount = this.props.loanRequests.data.total || 0;
    const loanRequestsTextPlural = loanRequestsCount !== 1;

    const docRequestsCount = this.props.documentRequests.data.total || 0;
    const docRequestsTextPlural = docRequestsCount !== 1;
    return (
      <Container className="spaced">
        <Statistic.Group widths="three" size={'small'}>
          <Statistic>
            <Statistic.Value>{loansCount}</Statistic.Value>
            <Statistic.Label>
              ongoing loan{loansTextPlural && 's'}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{loanRequestsCount}</Statistic.Value>
            <Statistic.Label>
              loan request{loanRequestsTextPlural && 's'}
            </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{docRequestsCount}</Statistic.Value>
            <Statistic.Label>
              Request{docRequestsTextPlural && 's'} for new literature
            </Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Container>
    );
  }
}

PatronOverview.propTypes = {
  currentLoans: PropTypes.object.isRequired,
  loanRequests: PropTypes.object.isRequired,
  documentRequests: PropTypes.object.isRequired,
};
