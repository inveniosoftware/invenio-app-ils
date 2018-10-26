import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Icon } from 'semantic-ui-react';
import { URLS } from 'common/urls';

import './NotFound.scss';

export class NotFound extends Component {
  render() {
    return (
      <Grid
        container
        verticalAlign="middle"
        textAlign="center"
        className="not-found"
      >
        <Grid.Column>
          <Icon name="compass outline" size="massive" />
          <h1>404</h1>
          <h2>Not all who wander are lost..</h2>
          <Link to={URLS.root}>
            <Button className="teal">back to office</Button>
          </Link>
        </Grid.Column>
      </Grid>
    );
  }
}
