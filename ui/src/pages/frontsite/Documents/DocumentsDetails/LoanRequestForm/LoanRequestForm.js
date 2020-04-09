import React, { Component } from 'react';
import { Button, Checkbox, Form, Message } from 'semantic-ui-react';
import { DatePicker } from '@components';
import PropTypes from 'prop-types';
import { invenioConfig } from '@config';
import { DateTime } from 'luxon';
import { toShortDate } from '@api/date';
import isEmpty from 'lodash/isEmpty';

export default class LoanRequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestEndDate: '',
      deliveryMethod: '',
    };

    // init delivery method
    this.withDeliveryMethod = !isEmpty(
      invenioConfig.circulation.deliveryMethods
    );
    this.deliveryMethods = this.withDeliveryMethod
      ? Object.keys(invenioConfig.circulation.deliveryMethods).map(key => ({
          key: key,
          value: key,
          text: invenioConfig.circulation.deliveryMethods[key],
        }))
      : [];
    this.state['deliveryMethod'] = this.withDeliveryMethod
      ? this.deliveryMethods[0].value
      : null;

    this.props.initializeState();
  }

  requestLoanButton = () => {
    return (
      <Button
        positive
        size="small"
        content="Request"
        onClick={this.requestLoan}
      />
    );
  };

  handleRequestEndDateChange = value => {
    this.setState({ requestEndDate: value });
  };

  handleDeliveryMethodChange = (_, { value }) => {
    this.setState({ deliveryMethod: value });
  };

  handleSubmit = () => {
    const documentPid = this.props.document.metadata.pid;
    const optionalParams = {};
    if (!isEmpty(this.state.requestEndDate)) {
      optionalParams.requestEndDate = this.state.requestEndDate;
    }
    if (!isEmpty(this.state.deliveryMethod)) {
      optionalParams.deliveryMethod = this.state.deliveryMethod;
    }
    this.props.requestLoanForDocument(documentPid, optionalParams);
  };

  renderDeliveryRadioButtons = () => {
    return this.deliveryMethods.map(method => (
      <Checkbox
        radio
        label={method.text}
        name={'deliveryMethodRadioGroup'}
        value={method.value}
        checked={this.state.deliveryMethod === method.value}
        onChange={this.handleDeliveryMethodChange}
        key={method.value}
      />
    ));
  };

  renderDeliveryMethodSelector = () => {
    return this.withDeliveryMethod ? (
      <>
        <Form.Field required>
          <label>I would like to</label>
        </Form.Field>
        <Form.Field>{this.renderDeliveryRadioButtons()}</Form.Field>
      </>
    ) : null;
  };

  renderOptionalRequestExpirationDate = () => {
    const today = DateTime.local();
    const initialDate = new DateTime(today.plus({ days: 10 }));
    const max = new DateTime(
      today.plus({ days: invenioConfig.circulation.requestDuration })
    );
    return (
      <Form.Field>
        <label>Do you require it before a certain date? (optional)</label>
        <DatePicker
          initialDate={toShortDate(initialDate)}
          minDate={toShortDate(today)}
          maxDate={toShortDate(max)}
          placeholder="Pick the date"
          handleDateChange={this.handleRequestEndDateChange}
        />
      </Form.Field>
    );
  };

  render() {
    const { error, hasError, isSuccessful } = this.props;
    return (
      <Form>
        {this.renderDeliveryMethodSelector()}
        {this.renderOptionalRequestExpirationDate()}
        {hasError && (
          <Message
            negative
            header="Error"
            content={error.response.data.message}
          />
        )}
        {isSuccessful && (
          <Message
            positive
            header="Success"
            content="You have requested to loan this book."
          />
        )}
        <Form.Button type="button" primary fluid onClick={this.handleSubmit}>
          Request
        </Form.Button>
      </Form>
    );
  }
}

LoanRequestForm.propTypes = {
  requestLoanForDocument: PropTypes.func.isRequired,
  initializeState: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
};
