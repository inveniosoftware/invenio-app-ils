import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '../../../common/components';
import {
  DocumentDetails,
  DocumentMetadata,
  DocumentItems,
  DocumentPendingLoans,
} from './components';

export default class DocumentDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = this.props.deleteDocument;
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.documentPid) {
        this.fetchDocumentDetails(location.state.documentPid);
      }
    });
    this.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    // NOTE: We can encapsulate the Loader and the Error inside each of the
    // child components and the pass this.props.document instead of just data.
    return (
      <Container>
        <Loader isLoading={this.props.document.isLoading}>
          <Error error={this.props.document.error}>
            <DocumentMetadata data={this.props.document.data} />
          </Error>
        </Loader>
        {/* <DocumentPendingLoans document={data} />
          <DocumentItems document={data} /> */}
      </Container>
    );
  }
}

DocumentDetailsContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  fetchDocumentDetails: PropTypes.func.isRequired,
};
