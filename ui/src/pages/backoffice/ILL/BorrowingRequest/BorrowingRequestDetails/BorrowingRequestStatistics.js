import { toShortDate } from '@api/date';
import { getDisplayVal } from '@config/invenioConfig';
import PropTypes from 'prop-types';
import React from 'react';
import { Statistic } from 'semantic-ui-react';

export class BorrowingRequestStatistics extends React.Component {
  renderStatusCancelled(status) {
    const { cancel_reason: cancelReason } = this.props.brwReq;
    return (
      <Statistic color="grey">
        <Statistic.Value>{status}</Statistic.Value>
        <Statistic.Label>Reason: {cancelReason || '-'}</Statistic.Label>
      </Statistic>
    );
  }

  renderStatusOthers(status) {
    return (
      <Statistic>
        <Statistic.Label>Status</Statistic.Label>
        <Statistic.Value>{status}</Statistic.Value>
      </Statistic>
    );
  }

  renderStatus() {
    const { status } = this.props.brwReq;
    const humanReadableStatus = getDisplayVal(
      'illBorrowingRequests.statuses',
      status
    );
    switch (status) {
      case 'PENDING':
      case 'REQUESTED':
      case 'ON_LOAN':
      case 'RETURNED':
        return this.renderStatusOthers(humanReadableStatus);
      case 'CANCELLED':
        return this.renderStatusCancelled(humanReadableStatus);
      default:
        return null;
    }
  }

  renderLoanEnds() {
    const { loan_end_date: loanEndDate } = this.props.brwReq;
    return (
      <Statistic>
        <Statistic.Label>Loan ends</Statistic.Label>
        <Statistic.Value>
          {loanEndDate ? toShortDate(loanEndDate) : '-'}
        </Statistic.Value>
      </Statistic>
    );
  }

  render() {
    const status = this.props.brwReq.status;
    const widths = status === 'CANCELLED' ? 'one' : 'two';
    return (
      <Statistic.Group widths={widths} className="detail-statistics">
        {this.renderStatus()}
        {status !== 'CANCELLED' && this.renderLoanEnds()}
      </Statistic.Group>
    );
  }
}

BorrowingRequestStatistics.proptTypes = {
  brwReq: PropTypes.object.isRequired,
};
