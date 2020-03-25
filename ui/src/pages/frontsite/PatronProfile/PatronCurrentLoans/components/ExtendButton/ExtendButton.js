import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { invenioConfig, ES_DELAY } from '@config';
import _get from 'lodash/get';
import _has from 'lodash/has';

const expireDays = invenioConfig.circulation.loanWillExpireDays;

export default class ExtendButton extends Component {
  static INFO_MESSAGES = {
    extendUrl: 'It is not possible to extend this loan!',
    extendAction: reqDate =>
      `It is too early for extending the loan. You can request an extension from
      ${reqDate
        .minus({ days: expireDays })
        .toLocaleString({ month: 'long', day: 'numeric' })}`,
    maxExtensions:
      'You have reached the max number of extensions for this loan!',
    documentOverbook:
      'There is a high demand for this literature, therefore is not possible to automatically extend the loan!',
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

  validateExtendUrl() {
    return _has(this.props.loan, 'availableActions.extend');
  }

  validateExtendAction() {
    return (
      _get(this.props.loan, 'metadata.end_date').diffNow('days').days <=
      expireDays
    );
  }

  validateMaxExtensions() {
    return (
      _get(this.props.loan, 'metadata.extension_count', 0) <=
      invenioConfig.circulation.extensionsMaxCount
    );
  }

  validateDocumentOverbook() {
    const isOverbooked = _get(
      this.props.loan,
      'metadata.document.circulation.overbooked',
      false
    );
    return !isOverbooked;
  }

  validate = () => {
    if (!this.validateExtendUrl())
      return { isValid: false, msg: ExtendButton.INFO_MESSAGES.extendUrl };

    if (!this.validateExtendAction()) {
      return {
        isValid: false,
        msg: ExtendButton.INFO_MESSAGES.extendAction(
          _get(this.props.loan, 'metadata.end_date')
        ),
      };
    }

    if (!this.validateMaxExtensions())
      return {
        isValid: false,
        msg: ExtendButton.INFO_MESSAGES.maxExtensions,
      };

    if (!this.validateDocumentOverbook())
      return {
        isValid: false,
        msg: ExtendButton.INFO_MESSAGES.documentOverbook,
      };

    return { isValid: true, msg: '' };
  };

  render() {
    const validation = this.validate();
    const isDisabled = !validation.isValid;

    return (
      <>
        <Button
          color="purple"
          size="mini"
          content="Request extension"
          disabled={isDisabled}
          onClick={this.handleExtendRequest}
        />
        {isDisabled && (
          <Popup
            content={validation.msg}
            trigger={<Icon name={'info'} />}
            position={'top right'}
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
