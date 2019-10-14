import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Message } from 'semantic-ui-react';
import Qs from 'qs';
import { FrontSiteRoutes } from '../../../../../../routes/urls';

export default class SearchMessage extends Component {
  onClickBookRequestLink = () => {
    const params = Qs.parse(window.location.search);
    const queryString = params['?q'];
    return {
      pathname: FrontSiteRoutes.documentRequestForm,
      state: { queryString },
    };
  };

  render() {
    const requestFormLink = (
      <Link to={this.onClickBookRequestLink()}>request form</Link>
    );
    return (
      <Message icon color="yellow">
        <Icon name="info circle" />
        <Message.Content>
          <Message.Header>
            Couldn't find the book you were looking for?
          </Message.Header>
          Please fill in the {requestFormLink} to request a new book from the
          library.
        </Message.Content>
      </Message>
    );
  }
}
