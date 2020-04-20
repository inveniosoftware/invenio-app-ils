import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { getDisplayVal, invenioConfig } from '@config/invenioConfig';
import { LoanIcon } from '@pages/backoffice/components';

class BorrowingRequestStep extends Component {
  render() {
    const {
      status,
      currentStatus,
      disabled,
      icon,
      iconName,
      description,
    } = this.props;
    return (
      <Step
        active={currentStatus === status}
        disabled={disabled || isBefore(currentStatus, status)}
      >
        {icon}
        {iconName && <Icon name={iconName} />}
        <Step.Content>
          <Step.Title className="uppercase">{toLabel(status)}</Step.Title>
          {description && <Step.Description>{description}</Step.Description>}
        </Step.Content>
      </Step>
    );
  }
}

BorrowingRequestStep.propTypes = {
  status: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  icon: PropTypes.element,
  iconName: PropTypes.string,
};

BorrowingRequestStep.defaultProps = {
  disabled: false,
  description: null,
  icon: null,
  iconName: null,
};

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

export class BorrowingRequestSteps extends Component {
  render() {
    const currentStatus = this.props.brwReq.status;
    const allDisabled = currentStatus === 'CANCELLED';
    return (
      <Segment>
        <Step.Group size="mini" fluid widths={4}>
          <BorrowingRequestStep
            status={'PENDING'}
            currentStatus={currentStatus}
            disabled={allDisabled}
            iconName={'hourglass half'}
            description={'New request created'}
          />
          <BorrowingRequestStep
            status={'REQUESTED'}
            currentStatus={currentStatus}
            disabled={allDisabled}
            iconName={'tasks'}
            description={'Item requested to the external library'}
          />
          <BorrowingRequestStep
            status={'ON_LOAN'}
            currentStatus={currentStatus}
            disabled={allDisabled}
            icon={<LoanIcon />}
            description={'Item on loan to a patron'}
          />
          <BorrowingRequestStep
            status={'RETURNED'}
            currentStatus={currentStatus}
            disabled={allDisabled}
            iconName={'check'}
            description={'Item returned to the external library'}
          />
        </Step.Group>
      </Segment>
    );
  }
}

BorrowingRequestSteps.propTypes = {
  brwReq: PropTypes.object.isRequired,
};
