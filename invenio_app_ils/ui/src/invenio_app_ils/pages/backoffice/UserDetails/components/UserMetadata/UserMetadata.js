import React, { Component } from 'react';
import { Grid, Segment, List, Header, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class UserMetadata extends Component {
  render() {
    const data = this.props.userDetails.data;

    let label;
    if (data && data.active) {
      label = (
        <Label as="a" color="green" ribbon>
          Active
        </Label>
      );
    } else {
      label = (
        <Label as="a" color="red" ribbon>
          Deactivated
        </Label>
      );
    }

    return (
      <Segment className="item-metadata">
        {label}
        <Grid padded columns={2}>
          <Grid.Column width={10}>
            <Header as="h1">Patron - {data.user_pid}</Header>
          </Grid.Column>
          <Grid.Column>
            <List relaxed size="large">
              <List.Item>
                <List.Header>Patron PID</List.Header>
                {data.user_pid}
              </List.Item>
              <List.Item>
                <List.Header>Email</List.Header>
                {data.email}
              </List.Item>
              <List.Item>
                <List.Header>Active</List.Header>
                {data.active.toString()}
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

UserMetadata.propTypes = {
  userDetails: PropTypes.object.isRequired,
};
