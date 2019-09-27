import React, { Component } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { Error } from '../../../../../../common/components/Error';
import { DatePicker } from '../../../../../../common/components';
import PropTypes from 'prop-types';
import { invenioConfig } from '../../../../../../common/config';
import { DateTime } from 'luxon';
import { toShortDate} from '../../../../../../common/api/date';
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
      ? this.deliveryMethods[1].value
      : null;
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

  renderDeliveryMethodSelector = () => {
    return this.withDeliveryMethod ? (
      <Form.Field>
        <label>Choose the book delivery method</label>
        <Form.Dropdown
          placeholder={'Select delivery method'}
          options={this.deliveryMethods}
          onChange={this.handleDeliveryMethodChange}
          defaultValue={this.deliveryMethods[1].value}
          selection
        />
      </Form.Field>
    ) : null;
  };

  renderOptionalRequestExpirationDate = () => {
    const today = DateTime.local();
    const initialDate = new DateTime(today.plus({ days: 10 }));
    const max = new DateTime(
      today.plus({ days: invenioConfig.circulation.requestDuration })
    );
    return (
      <div>
        <Segment.Inline>
          <div>Optionally, select a limit date for your request</div>
          <DatePicker
            initialDate={toShortDate(initialDate)}
            minDate={toShortDate(today)}
            maxDate={toShortDate(max)}
            placeholder="Request limit date"
            handleDateChange={this.handleRequestEndDateChange}
          />
        </Segment.Inline>
      </div>
    );
  };

  render() {
    const { error } = this.props;
    return (
      <Error error={error}>
        <Form>
          <Segment.Group>
            <Segment>
              <Header as="h3" content="Request loan" />
            </Segment>
            <Segment>
              {this.renderDeliveryMethodSelector()}
              {this.renderOptionalRequestExpirationDate()}
            </Segment>
            <Segment>
              <Form.Button onClick={this.handleSubmit}>Request</Form.Button>
            </Segment>
          </Segment.Group>
        </Form>
      </Error>
    );
  }
}

LoanRequestForm.propTypes = {
  requestLoanForDocument: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
};
