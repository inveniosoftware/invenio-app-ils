import React, { Component } from 'react';
import { ItemList } from './components/ItemList/ItemList';

export default class ItemListContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchItemList = this.props.fetchItemList;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state) {
        this.fetchItemList();
      }
    });
    this.fetchItemList();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return <ItemList {...this.props} />;
  }
}
