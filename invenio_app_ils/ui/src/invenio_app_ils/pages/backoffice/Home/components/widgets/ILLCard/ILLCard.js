import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';
import { NewButton, SeeAllButton } from '../../../../components/buttons';

export default class ILLCard extends Component {
  constructor(props) {
    super(props);

    // TODO when acquisition module
    this.seeAllUrl = '';
    this.newILLUrl = '';
  }

  componentDidMount() {}

  _seeAllButton = () => {
    // TODO when #155 solved
    return (
      <SeeAllButton
        fluid
        disabled
        clickHandler={() => this.props.history.push(this.seeAllUrl)}
      />
    );
  };

  _newAcqButton = () => {
    return (
      <NewButton
        fluid
        disabled
        clickHandler={() => this.props.history.push(this.newILLUrl)}
      />
    );
  };

  _render_card = data => {
    return (
      <RecordsBriefCard
        title={'ILL Requests'}
        stats={data}
        text={'ongoing'}
        buttonLeft={this._newAcqButton()}
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

ILLCard.propTypes = {
  // fetchOngoingILLRequests: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
