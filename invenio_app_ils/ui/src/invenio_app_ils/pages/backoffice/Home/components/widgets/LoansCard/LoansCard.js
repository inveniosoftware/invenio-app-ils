import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { loan as loanApi } from '../../../../../../common/api';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';

import {
  loanSearchQueryUrl,
  BackOfficeURLS,
} from '../../../../../../common/urls';
import { Button, Icon } from 'semantic-ui-react';

export default class LoansCard extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.showAllUrl = loanSearchQueryUrl;
    this.newLoanURL = BackOfficeURLS.newLoan;
  }

  componentDidMount() {
    this.fetchPendingLoans();
  }

  _showAllButton = () => {
    let handler = () =>
      this.props.history.push(
        this.showAllUrl(
          loanApi
            .query()
            .withState('PENDING')
            .qs()
        )
      );
    return (
      <Button fluid onClick={() => handler()}>
        See all
      </Button>
    );
  };

  _newLoanButton = () => {
    let handler = () => this.props.history.push(this.newLoanURL);
    return (
      <Button fluid icon positive onClick={() => handler()}>
        <Icon name="plus" />
        New
      </Button>
    );
  };

  _render_card = data => {
    return (
      <RecordsBriefCard
        title={'Loans'}
        stats={data}
        text={'new requests'}
        buttonLeft={this._newLoanButton()}
        buttonRight={this._showAllButton()}
      />
    );
  };

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>{this._render_card(data)}</Error>
      </Loader>
    );
  }
}

LoansCard.propTypes = {
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
