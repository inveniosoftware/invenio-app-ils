import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemMetadata } from './components/ItemMetadata/ItemMetadata';
import { ItemLoans } from './components/ItemLoans/ItemLoans';

export default class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchItemDetails = this.props.fetchItemDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.itemId) {
        this.fetchItemDetails(location.state.itemId);
      }
    });
    this.fetchItemDetails(this.props.match.params.itemId);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <section>
        <ItemMetadata {...this.props} />
        <ItemLoans />
      </section>
    );
  }
}

ItemDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};
