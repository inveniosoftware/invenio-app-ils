import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { invenioConfig } from '../../../../../../common/config';
import { loan as loanApi } from '../../../../../../common/api';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { NewButton, SeeAllButton } from '../../../../components/buttons';

export default class LoansCard extends Component {
  componentDidMount() {
    this.props.fetchPendingLoans();
  }

  seeAllButton = () => {
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withState(invenioConfig.circulation.loanRequestStates)
        .qs()
    );
    return <SeeAllButton fluid disabled url={path} />;
  };

  newLoanButton = () => {
    return (
      <NewButton
        fluid
        disabled
        clickHandler={() => {
          /* not implemented */
        }}
      />
    );
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
