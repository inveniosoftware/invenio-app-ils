import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { EItemDetails } from './components';

export default class EItemDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchEItemDetails = this.props.fetchEItemDetails;
  }

  componentDidMount() {
    this.fetchEItemDetails(this.props.match.params.eitemPid);
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
