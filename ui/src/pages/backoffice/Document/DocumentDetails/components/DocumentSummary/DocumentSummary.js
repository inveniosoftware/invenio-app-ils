import { EItemIcon, ItemIcon, LoanIcon } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Statistic } from 'semantic-ui-react';

export default class DocumentSummary extends Component {
  scrollTo(ref) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth', block: 'end' });
  }

  render() {
    const { document, anchors } = this.props;
    return (
      <Statistic.Group
        widths="five"
        size="tiny"
        className="bo-document-summary"
      >
        <Statistic
          onClick={() => this.scrollTo(anchors.attachedItemsRef)}
          className="anchored"
        >
          <Statistic.Value>{document.metadata.items.total}</Statistic.Value>
          <Statistic.Label>
            <ItemIcon />
            Physical copies
          </Statistic.Label>
        </Statistic>
        <Statistic
          onClick={() => this.scrollTo(anchors.attachedEItemsRef)}
          className="anchored"
        >
          <Statistic.Value>{document.metadata.eitems.total}</Statistic.Value>
          <Statistic.Label>
            <EItemIcon /> E-items
          </Statistic.Label>
        </Statistic>
        <Statistic
          onClick={() => this.scrollTo(anchors.attachedItemsRef)}
          className="anchored"
        >
          <Statistic.Value>
            {document.metadata.circulation.active_loans}
          </Statistic.Value>
          <Statistic.Label>
            <LoanIcon />
            Active loans
          </Statistic.Label>
        </Statistic>
        <Statistic
          onClick={() => this.scrollTo(anchors.loanRequestsRef)}
          className="anchored"
        >
          <Statistic.Value>
            {document.metadata.circulation.pending_loans}
          </Statistic.Value>
          <Statistic.Label>
            <Icon name="wait" />
            Loan requests
          </Statistic.Label>
        </Statistic>
        <Statistic
          className="anchored"
          onClick={() => this.scrollTo(anchors.attachedItemsRef)}
        >
          <Statistic.Value>
            {document.metadata.circulation.has_items_for_loan}
          </Statistic.Value>
          <Statistic.Label>Items available for loan</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  }
}

DocumentSummary.propTypes = {
  document: PropTypes.object.isRequired,
};
