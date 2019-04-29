import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { ItemDetails } from './components';

export default class ItemDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchItemDetails = this.props.fetchItemDetails;
    this.deleteItem = this.props.deleteItem;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.itemPid) {
        this.fetchItemDetails(location.state.itemPid);
      }
    });
    this.fetchItemDetails(this.props.match.params.itemPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Container>
        <ItemDetails />
      </Container>
    );
  }
}

ItemDetailsContainer.propTypes = {
  fetchItemDetails: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};
