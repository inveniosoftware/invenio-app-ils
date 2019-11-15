import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { ItemMetadata, ItemPastLoans } from './components';

export default class ItemDetails extends Component {
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
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <ItemMetadata />
            <ItemPastLoans />
          </Error>
        </Loader>
      </Container>
    );
  }
}

ItemDetails.propTypes = {
  fetchItemDetails: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};
