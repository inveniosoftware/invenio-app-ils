import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemDetails } from './components/ItemDetails/ItemDetails';

export default class ItemDetailsContainer extends Component {
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
    let { isLoading, data, error } = this.props;
    return <ItemDetails data={data} isLoading={isLoading} error={error} />;
  }
}

ItemDetailsContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
