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
    let { data, isLoading, error } = this.props;
    return <ItemList data={data} isLoading={isLoading} error={error} />;
  }
}

ItemListContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
