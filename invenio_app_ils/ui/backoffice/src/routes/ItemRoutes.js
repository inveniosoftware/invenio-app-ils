import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ItemsSearch, ItemDetailsContainer } from 'pages';

export class ItemRoutes extends Component {
  render() {
    let { match } = this.props;
    return (
      <Switch>
        <Route path={match.path} exact component={ItemsSearch} />
        <Route
          path={`${match.path}/:itemPid`}
          component={ItemDetailsContainer}
        />
      </Switch>
    );
  }
}
