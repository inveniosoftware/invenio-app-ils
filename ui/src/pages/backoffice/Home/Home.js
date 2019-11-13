import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import {
  LoansCard,
  DocumentsCard,
  ACQRequestsCard,
  ILLCard,
  OverbookedDocumentsList,
  OverdueLoansList,
  IdleLoansList,
  RenewedLoansList,
  PendingOverdueDocumentsList,
} from './components';

export default class Home extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row columns={4}>
          <Grid.Column>
            <LoansCard />
          </Grid.Column>
          <Grid.Column>
            <DocumentsCard />
          </Grid.Column>
          <Grid.Column>
            <ACQRequestsCard data={0} />
          </Grid.Column>
          <Grid.Column>
            <ILLCard data={0} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <IdleLoansList />
            <OverdueLoansList />
            <RenewedLoansList />
          </Grid.Column>
          <Grid.Column>
            <OverbookedDocumentsList />
            <PendingOverdueDocumentsList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
