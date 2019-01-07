import { Component } from 'react';
import PropTypes from 'prop-types';

import { ItemView, LoanView } from './components';
import './ItemMetadata.scss';

export default class ItemMetadata extends Component {
  render() {
    switch (this.props.view) {
      case 'item':
        return ItemView(this.props);
      case 'loan':
        return LoanView(this.props);
      default:
        return null;
    }
  }
}

ItemMetadata.propTypes = {
  item: PropTypes.object.isRequired,
  view: PropTypes.oneOf(['item', 'loan']),
};
