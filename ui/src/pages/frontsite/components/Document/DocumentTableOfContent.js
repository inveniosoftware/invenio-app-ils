import React, { Component } from 'react';
import { Divider, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentTableOfContent extends Component {
  constructor(props) {
    super(props);
    this.toc = props.toc;
  }

  renderTOCList = () => {
    return this.toc.map((entry, idx) => (
      <List.Item key={idx}>
        <List.Content>{entry}</List.Content>
      </List.Item>
    ));
  };

  render() {
    if (this.toc.length > 0) {
      return (
        <>
          <Divider horizontal>Table of Content</Divider>
          <List ordered>{this.renderTOCList()}</List>
          <Divider horizontal>Abstract</Divider>
          {this.props.abstract}
        </>
      );
    } else {
      return null;
    }
  }
}

DocumentTableOfContent.propTypes = {
  toc: PropTypes.array.isRequired,
  abstract: PropTypes.string.isRequired,
  alternative_abstracts: PropTypes.array,
};
