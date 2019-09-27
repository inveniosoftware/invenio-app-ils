import React, { Component } from 'react';
import { Divider, Label, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentTags extends Component {
  constructor(props) {
    super(props);
    this.links = props.links;
  }

  renderUrlsList = () => {
    return this.links.map(link => (
      <List.Item href={link.value}>
        <List.Content>{link.description}</List.Content>
      </List.Item>
    ));
  };

  render() {
    if (this.links.length > 0) {
      return (
        <>
          <Divider horizontal>Urls</Divider>
          <List>{this.renderUrlsList()}</List>
        </>
      );
    } else {
      return null;
    }
  }
}

DocumentTags.propTypes = {
  tags: PropTypes.array.isRequired,
};
