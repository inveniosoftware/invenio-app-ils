import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../../common/components';
import { RecordsBriefCard } from '../../../../components/statistics/RecordsBriefCard';

import { BackOfficeURLS } from '../../../../../../common/urls';
import { Button, Icon } from 'semantic-ui-react';

export default class DocumentsCard extends Component {
  constructor(props) {
    super(props);
    this.fetchRequestedWithAvailableItems =
      props.fetchRequestedWithAvailableItems;
    // TODO when #155 solved
    this.showAllUrl = '';
    this.newDocumentURL = BackOfficeURLS.newDocument;
  }

  componentDidMount() {
    this.fetchRequestedWithAvailableItems();
  }

  _showAllButton = () => {
    let handler = () => this.props.history.push(this.showAllUrl);
    // TODO when #155 solved
    return (
      <Button disabled onClick={() => handler()}>
        See all
      </Button>
    );
  };

  _newDocumentButton = () => {
    let handler = () => this.props.history.push(this.newDocumentURL);
    return (
      <Button icon positive onClick={() => handler()}>
        <Icon name="plus" />
        New
      </Button>
    );
  };

  _render_card = data => {
    return (
      <RecordsBriefCard
        title={'Documents'}
        stats={data}
        text={'requested on shelf'}
        buttonLeft={this._newDocumentButton()}
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

DocumentsCard.propTypes = {
  fetchRequestedWithAvailableItems: PropTypes.func.isRequired,
  data: PropTypes.number.isRequired,
};
