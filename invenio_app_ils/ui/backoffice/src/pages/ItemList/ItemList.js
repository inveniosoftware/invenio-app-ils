import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { ItemTable } from './components/ItemTable/ItemTable';

export default class ItemList extends Component {
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
    return (
      <Container>
        <h1>Items</h1>
        <ItemTable {...this.props} />
      </Container>
    );
  }
}

ItemList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
