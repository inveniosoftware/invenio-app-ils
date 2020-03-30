import {
  ScrollingMenu,
  ScrollingMenuItem,
} from '@pages/backoffice/components/buttons/ScrollingMenu';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PatronActionMenu extends Component {
  render() {
    return (
      <div className={'bo-action-menu'}>
        <ScrollingMenu offset={this.props.offset}>
          <ScrollingMenuItem label="Checkout" elementId="patron-checkout" />
          <ScrollingMenuItem label="Current loans" elementId="current-loans" />
          <ScrollingMenuItem label="Loan requests" elementId="loan-requests" />
          <ScrollingMenuItem
            label="Literature requests"
            elementId="literature-requests"
          />
          <ScrollingMenuItem label="Loans history" elementId="loans-history" />
        </ScrollingMenu>
      </div>
    );
  }
}

PatronActionMenu.propTypes = {
  offset: PropTypes.number.isRequired,
};
