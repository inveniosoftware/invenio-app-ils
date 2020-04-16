import { invenioConfig } from '@config';
import InfoMessage from '@pages/backoffice/components/InfoMessage/InfoMessage';
import { BorrowingRequest } from './BorrowingRequest';
import { ItemMetadata } from './ItemMetadata';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Message, Segment } from 'semantic-ui-react';

export default class CurrentItem extends Component {
  isItemDeleted = () => {
    const data = this.props.loanDetails;
    return _isEmpty(data.metadata.item) && data.metadata.item_pid;
  };

  isItemILL = () => {
    return this.props.loanDetails.metadata.item_pid.type === 'illbid';
  };

  getTitle = loanState => {
    const isRequest = invenioConfig.circulation.loanRequestStates.includes(
      loanState
    );
    const isActiveLoan = invenioConfig.circulation.loanActiveStates.includes(
      loanState
    );
    let title = 'Physical copy of this loan';
    if (isRequest) {
      title = 'Physical copy assigned to fulfil the request';
    } else if (isActiveLoan) {
      title = 'Physical copy currently on loan';
    }
    return title;
  };

  renderDeletedItem = () => {
    const { loanDetails } = this.props;
    return (
      this.isItemDeleted() && (
        <Message
          warning
          icon="trash alternate"
          header={'Physical copy deleted'}
          content={`The physical copy ${loanDetails.metadata.item_pid.value} assigned to this loan has been deleted.`}
        />
      )
    );
  };

  renderItemOrEmpty = () => {
    const { loanDetails } = this.props;

    const hasItem = _get(loanDetails, 'metadata.item_pid');
    if (!hasItem) {
      return (
        <InfoMessage
          header="No physical copy assigned."
          content="Choose physical copy to assign to this loan from the list below."
        />
      );
    }
    if (this.isItemDeleted()) return this.renderDeletedItem();
    if (this.isItemILL())
      return <BorrowingRequest item={loanDetails.metadata.item} />;
    return (
      <ItemMetadata
        item={loanDetails.metadata.item}
        loanState={loanDetails.metadata.state}
        changeItemClickHandler={this.showAvailableItems}
      />
    );
  };

  render() {
    const { loanDetails } = this.props;
    return (
      <>
        <Header attached="top" as="h3">
          {this.getTitle(loanDetails.metadata.state)}
        </Header>
        <Segment attached className="bo-metadata-segment" id="current-item">
          {this.renderItemOrEmpty()}
        </Segment>
      </>
    );
  }
}

CurrentItem.propTypes = {
  /* REDUX */
  loanDetails: PropTypes.object.isRequired,
};
