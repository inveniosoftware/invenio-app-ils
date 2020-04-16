import React, { Component } from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import { LoanActions } from '../LoanActions';
import { LoanMetadata } from '../LoanMetadata';

export default class Loan extends Component {
  render() {
    return (
      <>
        <Header as="h3" attached="top">
          Loan
        </Header>
        <Segment attached className="bo-metadata-segment" id="loan-metadata">
          <LoanMetadata />
          <Divider horizontal>Manage loan</Divider>
          <div className="pb-default">
            <LoanActions />
          </div>
        </Segment>
      </>
    );
  }
}
