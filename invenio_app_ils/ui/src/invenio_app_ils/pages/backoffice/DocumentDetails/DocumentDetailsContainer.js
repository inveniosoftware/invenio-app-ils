import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentDetails } from './components';

export default class DocumentDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = this.props.deleteDocument;
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;
  }

  componentDidMount() {
    this.fetchDocumentDetails(this.props.match.params.documentPid);
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
