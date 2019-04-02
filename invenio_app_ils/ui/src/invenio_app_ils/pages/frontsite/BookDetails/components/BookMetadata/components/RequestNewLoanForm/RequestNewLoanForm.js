import React, { Component } from 'react';
import { Form, Transition } from 'semantic-ui-react';
import { Error } from '../../../../../../../common/components/Error';

export default class RequestNewLoanForm extends Component {
  constructor(props) {
    super(props);
    this.requestNewLoanForBook = this.props.requestNewLoanForBook.bind(this);
  }

  requestNewLoan = (itemPid, loan) => {
    this.requestNewLoanForBook(itemPid, loan);
  };

  render() {
    const { docPid, visible, error } = this.props;

    const loanData = {
      document_pid: docPid,
      patron_pid: '111', // FIXME: change this to be able to search for the user
    };
    const loanPeriodOptions = [
      { key: '1', value: '1', text: '2 Weeks' },
      { key: '2', value: '2', text: '3 Weeks' },
    ];

    return (
      <Error error={error}>
        <Transition visible={visible} animation="scale" duration={500}>
          <Form>
            <Form.Group widths="equal">
              <Form.Select
                fluid
                label="Loan Period"
                options={loanPeriodOptions}
                placeholder="Loan Period*"
              />
            </Form.Group>
            <Form.TextArea label="Comments" placeholder="Comments..." />
            <Form.Button onClick={() => this.requestNewLoan(docPid, loanData)}>
              Submit Loan Request
            </Form.Button>
            <div className="ui hidden divider" />
          </Form>
        </Transition>
      </Error>
    );
  }
}
