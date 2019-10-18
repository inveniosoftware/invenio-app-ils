import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentDetails } from './components';

export default class DocumentDetailsContainer extends Component {
  componentDidMount() {
    this.props.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.fetchDocumentDetails(this.props.match.params.documentPid);
    }
  }

  render() {
    return (
      <Container>
        <DocumentDetails />
      </Container>
    );
  }
}

DocumentDetailsContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  fetchDocumentDetails: PropTypes.func.isRequired,
};
