import React, { Component } from 'react';
import { Button, Divider, Transition, Form } from 'semantic-ui-react';

export default class BookButtons extends React.Component {
  state = { visible: false };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;

    const volumeOptions = [
      { key: '1', value: '1', text: 'Volume 1' },
      { key: '2', value: '2', text: 'Volume 2' },
    ];
    const editionOptions = [
      { key: '1', value: '1', text: 'Edition 1.2' },
      { key: '2', value: '2', text: 'Edition 1.3' },
    ];
    const loanPeriodOptions = [
      { key: '1', value: '1', text: '2 Weeks' },
      { key: '2', value: '2', text: '3 Weeks' },
    ];
    const deliveryMethodOptions = [
      { key: '1', value: '1', text: 'Internal Mail' },
      { key: '2', value: '2', text: 'UPS' },
    ];

    return (
      <div className="loan-request">
        <Button class="fluid ui button" size="large" color="blue">
          Open eBook
        </Button>

        <Button
          class="fluid ui button"
          primary
          size="large"
          color="blue"
          content={visible ? 'Loan Book' : 'Loan Book'}
          onClick={this.toggleVisibility}
        />
        <Divider hidden />
        <Transition visible={visible} animation="scale" duration={500}>
          <Form>
            <Form.Group widths="equal">
              <Form.Select
                fluid
                label="Edition"
                options={editionOptions}
                placeholder="Edition*"
              />
              <Form.Select
                fluid
                label="Volume"
                options={volumeOptions}
                placeholder="Volume*"
              />
              <Form.Select
                fluid
                label="Loan Period"
                options={loanPeriodOptions}
                placeholder="Loan Period*"
              />
              <Form.Select
                fluid
                label="DeliveryMethod"
                options={deliveryMethodOptions}
                placeholder="Delivery Method*"
              />
            </Form.Group>
            <Form.TextArea label="Comments" placeholder="Comments..." />
            <Form.Button>Submit Loan Request</Form.Button>
            <div className="ui hidden divider" />
          </Form>
        </Transition>
      </div>
    );
  }
}
