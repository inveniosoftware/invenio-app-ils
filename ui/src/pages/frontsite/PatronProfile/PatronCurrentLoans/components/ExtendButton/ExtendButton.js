import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { invenioConfig, ES_DELAY } from '@config';
import _get from 'lodash/get';
import _has from 'lodash/has';

export const INFO_MESSAGES = {
  hasMaxExtensions: 'You have reached the max number of extensions for a loan!',
  hasExtendAction:
    'Manually extending this loan, is not currently an available action!',
  hasPendingLoans:
    'Other users requested that book, therefore you cannot extend your loan.',
  isOverdue: 'You loan is overdue, therefore you cannot extend the loan!',
  isOwner: 'You are not the owner of this loan, so you cannot extend it!',
};

export default class ExtendButton extends Component {
  state = {
    hasExtendAction: false,
    hasMaxExtensions: false,
    hasPendingLoans: false,
    infoMessage: '',
    isOverdue: false,
    isOwner: false,
  };

  componentDidMount = () => {
    this.checkMaxExtensions();
    this.checkPendingLoans();
    this.checkIsOverdue();
    this.checkHasExtendAction();
    this.checkIsOwner();
  };

  checkMaxExtensions = () => {
    const { extension_count: extensionCount } = this.props.loan.metadata;
    const hasMaxExtensions =
      invenioConfig.circulation.extensionsMaxCount <= extensionCount;
    this.setState({ hasMaxExtensions: hasMaxExtensions });
    if (hasMaxExtensions)
      this.setState({ infoMessage: INFO_MESSAGES.hasMaxExtensions });
  };

  checkPendingLoans = () => {
    const { document } = this.props.loan.metadata;
    const hasPendingLoans = _get(document, 'circulation.pending_loans', 0) > 0;
    this.setState({ hasPendingLoans: hasPendingLoans });
    if (hasPendingLoans)
      this.setState({ infoMessage: INFO_MESSAGES.hasPendingLoans });
  };

  checkIsOverdue = () => {
    const { is_overdue: isOverdue } = this.props.loan.metadata;
    this.setState({ isOverdue: isOverdue });
    if (isOverdue) this.setState({ infoMessage: INFO_MESSAGES.isOverdue });
  };

  checkHasExtendAction = () => {
    const hasExtendAction = _has(this.props.loan, 'availableActions.extend');
    this.setState({ hasExtendAction: hasExtendAction });
    if (!hasExtendAction)
      this.setState({ infoMessage: INFO_MESSAGES.hasExtendAction });
  };

  checkIsOwner = () => {
    const { id: userId } = this.props.user;
    const { patron_pid: patronPid } = this.props.loan.metadata;

    const isOwner = userId === patronPid;
    this.setState({ isOwner: isOwner });
    if (!isOwner) this.setState({ infoMessage: INFO_MESSAGES.isOwner });
  };

  get isDisabled() {
    return (
      this.state.hasMaxExtensions ||
      this.state.hasPendingLoans ||
      this.state.isOverdue ||
      !this.state.hasExtendAction ||
      !this.state.isOwner
    );
  }

  handleExtendRequest = async () => {
    const { loan, onExtendSuccess } = this.props;
    const { document, patron_pid: patronPid } = loan.metadata;
    const extendUrl = _get(loan, 'availableActions.extend');

    await this.props.extendLoan(extendUrl, document.pid, patronPid);
    setTimeout(() => {
      onExtendSuccess();
    }, ES_DELAY);
  };

  render() {
    const { loan } = this.props;
    const showExtendButton =
      DateTime.fromISO(loan.metadata.end_date).diffNow('days').days <=
      invenioConfig.circulation.loanOverdueDaysUpfrontNotification;

    return (
      showExtendButton && (
        <>
          <Button
            color="purple"
            size="mini"
            content="extend loan"
            disabled={this.isDisabled}
            onClick={this.handleExtendRequest}
          />
          {this.isDisabled && (
            <Popup
              content={this.state.infoMessage}
              trigger={<Icon name={'info'} />}
              position={'top left'}
            />
          )}
        </>
      )
    );
  }
}

ExtendButton.propTypes = {
  loan: PropTypes.object.isRequired,
  extendLoan: PropTypes.func.isRequired,
  onExtendSuccess: PropTypes.func.isRequired,
};
