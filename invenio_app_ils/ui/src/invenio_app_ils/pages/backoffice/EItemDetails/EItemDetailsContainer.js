import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { EItemDetails } from './components';

export default class EItemDetailsContainer extends Component {
  componentDidMount() {
    this.props.fetchEItemDetails(this.props.match.params.eitemPid);
  }

  render() {
    return (
      <Container>
        <EItemDetails />
      </Container>
    );
  }
}

EItemDetailsContainer.propTypes = {
  fetchEItemDetails: PropTypes.func.isRequired,
};
