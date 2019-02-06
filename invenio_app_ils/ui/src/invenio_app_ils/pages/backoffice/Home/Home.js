import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { LoansCard, DocumentsCard, ACQRequestsCard, ILLCard } from '.';

export default class Home extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>{/*Tools*/}</Grid.Column>
          <Grid.Column width={12}>
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
                <Grid.Column width={6} />
                <Grid.Column width={6} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={6} />
                <Grid.Column width={6} />
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
