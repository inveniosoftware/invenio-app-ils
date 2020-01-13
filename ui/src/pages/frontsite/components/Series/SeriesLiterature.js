import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';

export class SeriesLiterature extends Component {
  render() {
    return <Divider horizontal>Literature in this series</Divider>;
  }
}

SeriesLiterature.propTypes = {
  metadata: PropTypes.object.isRequired,
};
