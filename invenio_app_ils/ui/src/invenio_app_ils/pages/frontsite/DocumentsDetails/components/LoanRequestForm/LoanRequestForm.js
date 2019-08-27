import React, { Component } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { Error } from '../../../../../common/components/Error';
import { DateRangePicker } from '../../../../../common/components';
import PropTypes from 'prop-types';
import { sessionManager } from '../../../../../authentication/services';
import { invenioConfig } from '../../../../../common/config';
import { DateTime } from 'luxon';
import { toShortDate, toUTCShortDate } from '../../../../../common/api/date';

export default class LoanRequestForm extends Component {
  constructor(props) {
    super(props);
    const tomorrow = DateTime.local().plus({ days: 1 });
    const loanDuration = new DateTime(
      tomorrow.plus({ days: invenioConfig.circulation.defaultDuration })
    );
    this.state = {
      fromDate: props.defaultStartDate
        ? props.defaultStartDate
        : toShortDate(tomorrow),
      toDate: props.defaultEndDate
        ? props.defaultEndDate
        : toShortDate(loanDuration),
      deliveryMethod: this.deliveryMethods()[1].value,
    };
  }

  requestLoanButton = () => {
    return (
      <>
        <Button
          positive
          size="small"
          content="Loan"
          onClick={this.requestLoan}
        />
      </>
    );
  };

  handleDateChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleDeliveryMethodChange = (event, object) => {
    this.setState({ deliveryMethod: object.value });
  };

  handleSubmit = () => {
    const documentPid = this.props.document.metadata.pid;
    const loanRequestData = {
      metadata: {
        start_date: toUTCShortDate(this.state.fromDate),
        end_date: toUTCShortDate(this.state.toDate),
        document_pid: documentPid,
        patron_pid: sessionManager.user.id,
        delivery: {
          method: this.state.deliveryMethod,
        },
      },
    };
    this.props.requestLoanForDocument(documentPid, loanRequestData);
  };

  deliveryMethods = () => {
    return invenioConfig.circulation.deliveryMethods.map(method => {
      return { key: method, value: method, text: method };
    });
  };

  render() {
    const { error } = this.props;
    return (
      <Error error={error}>
        <Form>
          <Segment.Group>
            <Segment>
              <Header
                as="h3"
                content="Request loan"
                subheader="Choose the period of interest for the book"
              />
            </Segment>
            <Segment>
              <Segment.Group horizontal>
                <DateRangePicker
                  defaultStart={this.state.fromDate}
                  defaultEnd={this.state.toDate}
                  handleDateChange={this.handleDateChange}
                />
              </Segment.Group>
              <Form.Field>
                <label>Choose the book delivery method</label>
                <Form.Dropdown
                  placeholder={'Select delivery method'}
                  options={this.deliveryMethods()}
                  onChange={this.handleDeliveryMethodChange}
                  defaultValue={this.deliveryMethods()[1].value}
                  selection
                />
              </Form.Field>
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
  defaultStartDate: PropTypes.string,
  defaultEndDate: PropTypes.string,
};
