import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Statistic } from 'semantic-ui-react';

export default class PatronOverview extends Component {
  render() {
    return (
      <Container className="spaced">
        <Statistic.Group widths="three" size={'small'}>
          <Statistic>
            <Statistic.Value>
              {this.props.currentLoans.data.total}
            </Statistic.Value>
            <Statistic.Label>ongoing loan(s)</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              {this.props.loanRequests.data.total}
            </Statistic.Value>
            <Statistic.Label>loan request(s)</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>
              {this.props.documentRequests.data.total}
            </Statistic.Value>
            <Statistic.Label>literature acquisition request(s)</Statistic.Label>
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
