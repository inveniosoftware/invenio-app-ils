import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentRequestDetails } from './components';

export default class DocumentRequestDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentRequestDetails = this.props.fetchDocumentRequestDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.documentRequestPid) {
        this.fetchDocumentRequestDetails(location.state.documentRequestPid);
      }
    });
    this.fetchDocumentRequestDetails(
      this.props.match.params.documentRequestPid
    );
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Container>
        <DocumentRequestDetails />
      </Container>
    );
  }
}

DocumentRequestDetailsContainer.propTypes = {
  fetchDocumentRequestDetails: PropTypes.func.isRequired,
};
