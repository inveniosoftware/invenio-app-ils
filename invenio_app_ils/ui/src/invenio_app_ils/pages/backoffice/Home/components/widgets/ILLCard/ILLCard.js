import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';
import { goToHandler } from '../../../../../../history';

export default class ILLCard extends Component {
  constructor(props) {
    super(props);

    // TODO when acquisition module
    this.seeAllUrl = '';
    this.newILLUrl = '';
  }

  componentDidMount() {}

  seeAllButton = () => {
    // TODO when #155 solved
    return (
      <SeeAllButton fluid disabled clickHandler={goToHandler(this.seeAllUrl)} />
    );
  };

  newAcqButton = () => {
    return (
      <NewButton fluid disabled clickHandler={goToHandler(this.newILLUrl)} />
    );
  };

  renderCard = data => {
    return (
      <RecordsBriefCard
        title={'ILL Requests'}
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

ILLCard.propTypes = {
  // fetchOngoingILLRequests: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
