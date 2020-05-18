import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Icon } from 'semantic-ui-react';

export class Forbidden extends Component {
  render() {
    return (
      <div className="frontsite">
        <Grid
          container
          verticalAlign="middle"
          textAlign="center"
          className="error-page"
        >
          <Grid.Column>
            <Icon name="ban" size="massive" />
            <h1>403</h1>
            <h2>You don't have access to this page.</h2>
            <Link to="/">
              <Button icon labelPosition="left" primary>
                <Icon name="home" />
                Back to home
              </Button>
            </Link>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
