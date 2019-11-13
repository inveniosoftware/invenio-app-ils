import React, { Component } from 'react';
import { Segment, List, Header, Label, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class PatronMetadata extends Component {
  render() {
    const data = this.props.patronDetails.data;

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
        <Container>
          <Header as="h1">Patron - #ID {data.user_pid}</Header>
          <List relaxed size="large">
            <List.Item>
              <List.Header>Email</List.Header>
              {data.email}
            </List.Item>
            <List.Item>
              <List.Header>Full name</List.Header>
              {data.full_name}
            </List.Item>
          </List>
        </Container>
      </Segment>
    );
  }
}

PatronMetadata.propTypes = {
  patronDetails: PropTypes.object.isRequired,
};
