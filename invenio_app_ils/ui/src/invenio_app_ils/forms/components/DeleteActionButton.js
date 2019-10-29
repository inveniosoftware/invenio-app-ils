import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

export class DeleteActionButton extends React.Component {
  render() {
    return (
      <Button icon basic onClick={this.props.onClick} type="button">
        <Icon name={this.props.icon} size={this.props.size} />
      </Button>
    );
  }
}

DeleteActionButton.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
};

DeleteActionButton.defaultProps = {
  icon: 'delete',
  size: 'large',
};
