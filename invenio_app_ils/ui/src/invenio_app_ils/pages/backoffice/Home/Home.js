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
} from './components';

export default class Home extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>{/*Tools*/}</Grid.Column>
          <Grid.Column width={14}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={3}>
                  <LoansCard />
                </Grid.Column>
                <Grid.Column width={3}>
                  <DocumentsCard />
                </Grid.Column>
                <Grid.Column width={3}>
                  <ACQRequestsCard data={0} />
                </Grid.Column>
                <Grid.Column width={3}>
                  <ILLCard data={0} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={6}>
                  <OverbookedDocumentsList />
                </Grid.Column>
                <Grid.Column width={6}>
                  <OverdueLoansList />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={6}>
                  <IdleLoansList />
                </Grid.Column>
                <Grid.Column width={6}>
                  <RenewedLoansList />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
