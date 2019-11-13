import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentDetails } from './components';
import history from '../../../history';

export default class DocumentDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = this.props.deleteDocument;
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Document') {
        this.fetchDocumentDetails(loc.state.pid);
      }
    });
    this.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
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
