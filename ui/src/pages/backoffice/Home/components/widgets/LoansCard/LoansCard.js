import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '@components';
import { invenioConfig } from '@config';
import { loan as loanApi } from '@api';
import { RecordsBriefCard } from '@pages/backoffice/components/statistics/RecordsBriefCard';
import { BackOfficeRoutes } from '@routes/urls';
import { NewButton, SeeAllButton } from '@pages/backoffice/components/buttons';

export default class LoansCard extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.seeAllUrl = BackOfficeRoutes.loansListWithQuery;
  }

  componentDidMount() {
    this.fetchPendingLoans();
  }

  seeAllButton = () => {
    const path = this.seeAllUrl(
      loanApi
        .query()
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton fluid disabled to={path} />;
  };

  newLoanButton = () => {
    return <NewButton fluid disabled to="" />;
  };

  renderCard = data => {
    return (
      <RecordsBriefCard
        title={'Loans'}
        stats={data}
        text={'new requests'}
        buttonLeft={this.newLoanButton()}
        buttonRight={this.seeAllButton()}
      />
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderCard(data)}</Error>
      </Loader>
    );
  }
}

LoansCard.propTypes = {
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
