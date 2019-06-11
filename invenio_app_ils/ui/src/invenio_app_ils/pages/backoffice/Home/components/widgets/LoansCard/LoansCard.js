import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { loan as loanApi } from '../../../../../../common/api';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import { goToHandler } from '../../../../../../history';

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
        .withState('PENDING')
        .qs()
    );
    return <SeeAllButton fluid disabled clickHandler={goToHandler(path)} />;
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
