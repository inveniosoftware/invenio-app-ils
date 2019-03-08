import React, { Component } from 'react';
import { Form, Transition } from 'semantic-ui-react';

export default class RequestNewLoanForm extends Component {
  constructor(props) {
    super(props);
    this.requestNewLoanForBook = this.props.requestNewLoanForBook.bind(this);
  }

  requestNewLoan = (itemPid, loan) => {
    this.requestNewLoanForBook(itemPid, loan);
  };

  render() {
    const { docPid, visible } = this.props;

    const loanData = {
      document_pid: docPid,
      patron_pid: '111', // FIXME: change this to be able to search for the user
    };

    //    const volumeOptions = [
    //      { key: '1', value: '1', text: 'Volume 1' },
    //      { key: '2', value: '2', text: 'Volume 2' },
    //    ];
    //    const editionOptions = [
    //      { key: '1', value: '1', text: 'Edition 1.2' },
    //      { key: '2', value: '2', text: 'Edition 1.3' },
    //    ];
    const loanPeriodOptions = [
      { key: '1', value: '1', text: '2 Weeks' },
      { key: '2', value: '2', text: '3 Weeks' },
    ];
    //    const deliveryMethodOptions = [
    //      { key: '1', value: '1', text: 'Internal Mail' },
    //      { key: '2', value: '2', text: 'UPS' },
    //    ];

    return (
      <Transition visible={visible} animation="scale" duration={500}>
        <Form>
          <Form.Group widths="equal">
            {/*<Form.Select
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
              />*/}
            <Form.Select
              fluid
              label="Loan Period"
              options={loanPeriodOptions}
              placeholder="Loan Period*"
            />
            {/*<Form.Select
                fluid
                label="DeliveryMethod"
                options={deliveryMethodOptions}
                placeholder="Delivery Method*"
              />*/}
          </Form.Group>
          <Form.TextArea label="Comments" placeholder="Comments..." />
          <Form.Button onClick={() => this.requestNewLoan(docPid, loanData)}>
            Submit Loan Request
          </Form.Button>
          <div className="ui hidden divider" />
        </Form>
      </Transition>
    );
  }
}
