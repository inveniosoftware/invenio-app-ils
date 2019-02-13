import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';

import { Button, Icon } from 'semantic-ui-react';

export default class ACQRequestsCard extends Component {
  constructor(props) {
    super(props);

    // TODO when acquisition module
    this.showAllUrl = '';
    this.newAcqURL = '';
  }

  componentDidMount() {}

  _showAllButton = () => {
    let handler = () => this.props.history.push(this.showAllUrl);

    return (
      <Button fluid disabled onClick={() => handler()}>
        See all
      </Button>
    );
  };

  _newAcqButton = () => {
    let handler = () => this.props.history.push(this.newAcqURL);
    return (
      <Button fluid disabled icon positive onClick={() => handler()}>
        <Icon name="plus" />
        New
      </Button>
    );
  };

  _render_card = data => {
    return (
      <RecordsBriefCard
        title={'ACQ Requests'}
        stats={data}
        text={'ongoing'}
        buttonLeft={this._newAcqButton()}
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

ACQRequestsCard.propTypes = {
  // fetchOngoingAcqRequests: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
