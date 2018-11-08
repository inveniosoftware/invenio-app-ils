import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    let { data, isLoading } = this.props;
    return <ItemList data={data} isLoading={isLoading} />;
  }
}

ItemListContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
