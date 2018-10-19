import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';

export class Backoffice extends Component {
  render() {
    return (
      <Grid container columns={2}>
        <Grid.Column>
          <Segment>
            <h3>Item list</h3>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <h3>Loan list</h3>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
