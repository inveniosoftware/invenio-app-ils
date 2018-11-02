import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ItemList, ItemDetails } from 'pages';

export class ItemRoutes extends Component {
  render() {
    let { match } = this.props;
    return (
      <Switch>
        <Route path={match.path} exact component={ItemList} />
        <Route path={`${match.path}/:itemId`} component={ItemDetails} />
      </Switch>
    );
  }
}
