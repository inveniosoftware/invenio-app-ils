import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { loan as loanApi } from '../../../../../../common/api';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import {
  loanSearchQueryUrl,
  BackOfficeURLS,
} from '../../../../../../common/urls';
import { NewButton, SeeAllButton } from '../../../../components/buttons';

export default class LoansCard extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.seeAllUrl = loanSearchQueryUrl;
    this.loanCheckout = BackOfficeURLS.loanCheckout;
  }

  componentDidMount() {
    this.fetchPendingLoans();
  }

  _seeAllButton = () => {
    const handler = () =>
      this.props.history.push(
        this.seeAllUrl(
          loanApi
            .query()
            .withState('PENDING')
            .qs()
        )
      );
    return <SeeAllButton fluid disabled clickHandler={() => handler()} />;
  };

  _newLoanButton = () => {
    return (
      <NewButton
        fluid
        disabled
        clickHandler={() => this.props.history.push(this.loanCheckout)}
      />
    );
  };

  _render_card = data => {
    return (
      <RecordsBriefCard
        title={'Loans'}
        stats={data}
        text={'new requests'}
        buttonLeft={this._newLoanButton()}
        buttonRight={this._seeAllButton()}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this._render_card(data)}</Error>
      </Loader>
    );
  }
}

LoansCard.propTypes = {
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
