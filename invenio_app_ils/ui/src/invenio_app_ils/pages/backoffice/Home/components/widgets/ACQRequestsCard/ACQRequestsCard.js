import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import { goToHandler } from '../../../../../../history';

export default class ACQRequestsCard extends Component {
  constructor(props) {
    super(props);

    // TODO when acquisition module
    this.seeAllUrl = '';
    this.newAcqURL = '';
  }

  componentDidMount() {}

  seeAllButton = () => {
    return (
      <SeeAllButton fluid disabled clickHandler={goToHandler(this.seeAllUrl)} />
    );
  };

  newAcqButton = () => {
    return (
      <NewButton fluid disabled clickHandler={goToHandler(this.newAcqURL)} />
    );
  };

  renderCard = data => {
    return (
      <RecordsBriefCard
        title={'ACQ Requests'}
        stats={data}
        text={'ongoing'}
        buttonLeft={this.newAcqButton()}
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

ACQRequestsCard.propTypes = {
  // fetchOngoingAcqRequests: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
