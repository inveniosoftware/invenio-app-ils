import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { DocumentRequestMetadata } from './components';

export default class DocumentRequestDetails extends Component {
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
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Container>
              <DocumentRequestMetadata />
            </Container>
          </Error>
        </Loader>
      </Container>
    );
  }
}

DocumentRequestDetails.propTypes = {
  fetchDocumentRequestDetails: PropTypes.func.isRequired,
};
