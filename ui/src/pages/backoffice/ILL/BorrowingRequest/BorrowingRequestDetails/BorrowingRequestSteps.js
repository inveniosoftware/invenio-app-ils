import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { getDisplayVal, invenioConfig } from '@config/invenioConfig';
import { LoanIcon } from '@pages/backoffice/components';

const toLabel = status => {
  return getDisplayVal('illBorrowingRequests.statuses', status);
};

const isBefore = (currentStatus, status) => {
  const orderedStatuses =
    invenioConfig.illBorrowingRequests.orderedValidStatuses;
  return (
    orderedStatuses.indexOf(currentStatus) < orderedStatuses.indexOf(status)
  );
};

const Pending = ({ currentStatus, disabled }) => {
  const status = 'PENDING';
  return (
    <Step
      active={currentStatus === status}
      disabled={disabled || isBefore(currentStatus, status)}
    >
      <Icon name="hourglass half" />
      <Step.Content>
        <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
        <Step.Description>New request created</Step.Description>
      </Step.Content>
    </Step>
  );
};

const Requested = ({ currentStatus, disabled }) => {
  const status = 'REQUESTED';
  return (
    <Step
      active={currentStatus === status}
      disabled={disabled || isBefore(currentStatus, status)}
    >
      <Icon name="tasks" />
      <Step.Content>
        <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
        <Step.Description>
          Item requested to the external library
        </Step.Description>
      </Step.Content>
    </Step>
  );
};

const OnLoan = ({ currentStatus, disabled }) => {
  const status = 'ON_LOAN';
  return (
    <Step
      active={currentStatus === status}
      disabled={disabled || isBefore(currentStatus, status)}
    >
      <LoanIcon />
      <Step.Content>
        <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
        <Step.Description>Item on loan to a patron</Step.Description>
      </Step.Content>
    </Step>
  );
};

const Returned = ({ currentStatus, disabled }) => {
  const status = 'RETURNED';
  return (
    <Step
      active={currentStatus === status}
      disabled={disabled || isBefore(currentStatus, status)}
    >
      <Icon name="check" />
      <Step.Content>
        <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
        <Step.Description>
          Item returned to the external library
        </Step.Description>
      </Step.Content>
    </Step>
  );
};

export class BorrowingRequestSteps extends Component {
  render() {
    const currentStatus = this.props.brwReq.status;
    const allDisabled = currentStatus === 'CANCELLED';
    return (
      <Segment>
        <Step.Group size="mini" fluid widths={4}>
          <Pending currentStatus={currentStatus} disabled={allDisabled} />
          <Requested currentStatus={currentStatus} disabled={allDisabled} />
          <OnLoan currentStatus={currentStatus} disabled={allDisabled} />
          <Returned currentStatus={currentStatus} disabled={allDisabled} />
        </Step.Group>
      </Segment>
    );
  }
}

BorrowingRequestSteps.propTypes = {
  brwReq: PropTypes.object.isRequired,
};
