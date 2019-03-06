import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react';

export default class BookInfo extends React.Component {
  render() {
    return (
      <div className="book-info">
        <Header as="h2">Title: {this.props.data.title}</Header>
        <List>
          {this.props.data.authors.map(author => (
            <List.Item as="h4">Author: {author}</List.Item>
          ))}
        </List>
        <List>
          {this.props.data.publishers.map(publisher => (
            <List.Item as="h5">Publisher: {publisher}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}
