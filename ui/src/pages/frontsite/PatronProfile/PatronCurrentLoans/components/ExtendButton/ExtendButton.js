import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { invenioConfig, ES_DELAY } from '@config';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _isEqual from 'lodash/isEqual';

const expireDays = invenioConfig.circulation.loanWillExpireDays;

export default class ExtendButton extends Component {
  static INFO_MESSAGES = {
    hasMaxExtensions:
      'You have reached the max number of extensions for THIS loan!',
    hasExtendAction: 'It is not possible to extend this loan!',
    hasPendingLoans:
      'Unfortunately it is not possible to extend this loan due to high demand for this literature!',
    isOverdue:
      'This loan is overdue, therefore it is not possible to extend it!',
    isExtendEnabled: `You can extend this loan ${expireDays} days before it expires!`,
  };

  handleExtendRequest = async () => {
    const { loan, onExtendSuccess } = this.props;
    const { document, patron_pid: patronPid } = loan.metadata;
    const extendUrl = _get(loan, 'availableActions.extend');

    await this.props.extendLoan(extendUrl, document.pid, patronPid);
    setTimeout(() => {
      onExtendSuccess();
    }, ES_DELAY);
  };

  get hasMaxExtensions() {
    return (
      invenioConfig.circulation.extensionsMaxCount <=
      _get(this.props.loan, 'metadata.extension_count', 0)
    );
  }

  get hasPendingLoans() {
    return (
      _get(this.props.loan, 'metadata.document.circulation.pending_loans', 0) >
      0
    );
  }

  get isOverdue() {
    return _get(this.props.loan, 'metadata.is_overdue', false);
  }

  get hasExtendAction() {
    return _has(this.props.loan, 'availableActions.extend');
  }

  get isExtendEnabled() {
    return (
      _get(this.props.loan, 'metadata.end_date').diffNow('days').days <=
      expireDays
    );
  }

  isDisabled = () =>
    this.hasMaxExtensions ||
    this.hasPendingLoans ||
    this.isOverdue ||
    !this.hasExtendAction ||
    !this.isExtendEnabled;

  infoMessage = () => {
    if (_isEqual(this.hasMaxExtensions, true))
      return _get(ExtendButton.INFO_MESSAGES, 'hasMaxExtensions');
    if (_isEqual(this.hasPendingLoans, true))
      return _get(ExtendButton.INFO_MESSAGES, 'hasPendingLoans');
    if (_isEqual(this.isOverdue, true))
      return _get(ExtendButton.INFO_MESSAGES, 'isOverdue');
    if (_isEqual(this.hasExtendAction, false))
      return _get(ExtendButton.INFO_MESSAGES, 'hasExtendAction');
    if (_isEqual(this.isExtendEnabled, false))
      return _get(ExtendButton.INFO_MESSAGES, 'isExtendEnabled');
  };

  render() {
    const isDisabled = this.isDisabled();

    return (
      <>
        <Button
          color="purple"
          size="mini"
          content="extend loan"
          disabled={isDisabled}
          onClick={this.handleExtendRequest}
        />
        {isDisabled && (
          <Popup
            content={this.infoMessage()}
            trigger={<Icon name={'info'} />}
          />
        )}
      </>
    );
  }
}

ExtendButton.propTypes = {
  loan: PropTypes.object.isRequired,
  extendLoan: PropTypes.func.isRequired,
  onExtendSuccess: PropTypes.func.isRequired,
};
