import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Icon } from 'semantic-ui-react';
import './NotFound.scss';

export class NotFound extends Component {
  render() {
    return (
      <Grid container verticalAlign="middle" textAlign="center">
        <Grid.Column>
          <Icon name="compass outline" size="massive" />
          <h1>404</h1>
          <h2>Not all who wander are lost..</h2>
          <Link to="/backoffice">
            <Button className="teal">back to work</Button>
          </Link>
        </Grid.Column>
      </Grid>
    );
  }
}
