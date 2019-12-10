import React from 'react';
import PropTypes from 'prop-types';
import { Rail, Sticky, Segment } from 'semantic-ui-react';

export class DetailsMenu extends React.Component {
  render() {
    return (
      <Rail position="right">
        <Sticky context={this.props.contextRef}>
          <Segment>{this.props.children}</Segment>
        </Sticky>
      </Rail>
    );
  }
}

DetailsMenu.propTypes = {
  contextRef: PropTypes.object.isRequired,
};
