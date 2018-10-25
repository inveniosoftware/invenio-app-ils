import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ItemDetails } from '../../pages/ItemDetails';
import { ItemList } from '../../pages/ItemList';

export class ItemLayout extends Component {
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
