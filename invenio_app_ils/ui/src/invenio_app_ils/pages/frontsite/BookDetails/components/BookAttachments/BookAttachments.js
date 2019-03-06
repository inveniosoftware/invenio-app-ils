import React, { Component } from 'react';
import { Grid, Header, List, Button, Icon } from 'semantic-ui-react';

export default class BookAccordion extends Component {
  render() {
    return (
      <Grid.Column width={3}>
        <Grid.Row>
          <Header as="h3">Share and Export</Header>
          <Button color="facebook">
            <Icon name="facebook" /> Facebook
          </Button>
          <div className="ui hidden divider" />
          <Button color="twitter">
            <Icon name="twitter" /> Twitter
          </Button>
          <div className="ui hidden divider" />
          <Button color="linkedin">
            <Icon name="linkedin" /> LinkedIn
          </Button>
          <div className="ui hidden divider" />
          <Button color="instagram">
            <Icon name="instagram" /> Instagram
          </Button>
          <div className="ui hidden divider" />
          <a href="https://cds.cern.ch/record/2653582/export/hx?ln=en">
            BibTex
          </a>
          <div className="ui divider" />
        </Grid.Row>

        <Grid.Row>
          <Header as="h3">Files</Header>
          <List>
            {this.props.data.files.map(file => (
              <List.Item as="a">{file}</List.Item>
            ))}
          </List>
        </Grid.Row>

        <Grid.Row>
          <Header as="h3">Links</Header>
          <List>
            {this.props.data.booklinks.map(link => (
              <List.Item as="a">{link}</List.Item>
            ))}
          </List>
        </Grid.Row>
      </Grid.Column>
    );
  }
}
