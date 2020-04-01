import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { EItemFiles, EItemMetadata } from './components';

export default class EItemDetails extends Component {
  componentDidMount() {
    this.props.fetchEItemDetails(this.props.match.params.eitemPid);
  }

  componentDidUpdate(prevProps) {
    const eitemPid = this.props.match.params.eitemPid;
    const samePidFromRouter = prevProps.match.params.eitemPid === eitemPid;
    if (!samePidFromRouter) {
      this.props.fetchEItemDetails(eitemPid);
    }
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <EItemMetadata />
            <EItemFiles />
          </Error>
        </Loader>
      </Container>
    );
  }
}

EItemDetails.propTypes = {
  fetchEItemDetails: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  error: PropTypes.object,
};
