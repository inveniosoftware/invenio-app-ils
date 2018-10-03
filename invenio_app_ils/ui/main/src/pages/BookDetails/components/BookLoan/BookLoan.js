import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';

class BookLoan extends Component {
  constructor() {
    super();
    this.loanBook = this.loanBook.bind(this);
  }

  async loanBook() {
    // You should replace that with your own access token generated from invenio
    let bearer = 'tEIJtQuNUmB3AyZGFqLsqHxQPbNBgThrMiQi17vYROaZPJJPNMgKqqKSx1Ie';
    var config = {
      headers: {
        Authorization: `bearer ${bearer}`,
        withCredentials: true,
      },
    };
    let payload = {
      item_pid: '7',
      patron_pid: '1',
      transaction_date: '2018-07-24',
      transaction_location_pid: 'loc_pid',
      transaction_user_pid: 'user_pid',
      pickup_location_pid: '2',
      request_expire_date: '2018-08-23',
    };
    let loanRequest = await axios.post(`/api/loan_request`, payload, config);
    console.log(loanRequest);
  }

  render() {
    return (
      <div>
        <h3>This book is available</h3>
        <Button primary onClick={this.loanBook}>
          LOAN BOOK
        </Button>
      </div>
    );
  }
}

export default BookLoan;
