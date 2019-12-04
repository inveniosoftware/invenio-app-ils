import React, { Component } from 'react';
import { Grid, Segment, Label } from 'semantic-ui-react';
import { Loader } from '@components';
import { parseParams } from '../utils';

const Confirmed = ({ isConfirmed }) => {
  return isConfirmed ? (
    <Label color="green">Your email has been confirmed.</Label>
  ) : (
    <Label color="red">Your email couldn't be confirmed.</Label>
  );
};

export default class ConfirmEmail extends Component {
  componentDidMount() {
    const params = parseParams(window.location.search);
    this.props.confirmUser(params.token);
  }

  render() {
    const { isConfirmed, isConfirmedLoading } = this.props;
    return (
      <Grid
        textAlign="center"
        verticalAlign="middle"
        columns={2}
        style={{ height: '100vh', backgroundColor: '#f9f9f9' }}
      >
        <Grid.Column>
          <Segment>
            <Loader
              isLoading={isConfirmedLoading}
              renderElement={() => <Label>Confirming...</Label>}
            >
              <Confirmed isConfirmed={isConfirmed} />
            </Loader>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
