import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { getDisplayVal, invenioConfig } from '@config/invenioConfig';

const toLabel = status => {
  return getDisplayVal('acqOrders.statuses', status);
};

const isBefore = (currentStatus, status) => {
  const orderedStatuses = invenioConfig.acqOrders.orderedValidStatuses;
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
        <Step.Description>New order created</Step.Description>
      </Step.Content>
    </Step>
  );
};

const Ordered = ({ currentStatus, disabled }) => {
  const status = 'ORDERED';
  return (
    <Step
      active={currentStatus === status}
      disabled={disabled || isBefore(currentStatus, status)}
    >
      <Icon name="tasks" />
      <Step.Content>
        <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
        <Step.Description>Order sent to the provider</Step.Description>
      </Step.Content>
    </Step>
  );
};

const Received = ({ currentStatus, disabled }) => {
  const status = 'RECEIVED';
  return (
    <Step
      active={currentStatus === status}
      disabled={disabled || isBefore(currentStatus, status)}
    >
      <Icon name="check" />
      <Step.Content>
        <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
        <Step.Description>Order received</Step.Description>
      </Step.Content>
    </Step>
  );
};

export class OrderSteps extends Component {
  render() {
    const currentStatus = this.props.order.status;
    const allDisabled = currentStatus === 'CANCELLED';
    return (
      <Segment>
        <Step.Group size="mini" fluid widths={4}>
          <Pending currentStatus={currentStatus} disabled={allDisabled} />
          <Ordered currentStatus={currentStatus} disabled={allDisabled} />
          <Received currentStatus={currentStatus} disabled={allDisabled} />
        </Step.Group>
      </Segment>
    );
  }
}

OrderSteps.propTypes = {
  order: PropTypes.object.isRequired,
};
