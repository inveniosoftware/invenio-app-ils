import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentDetails } from './components';

export default class DocumentDetailsContainer extends Component {
  constructor(props) {
    super(props);
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
    return (
      <Container>
        <DocumentDetails />
      </Container>
    );
  }
}

DocumentDetailsContainer.propTypes = {
  fetchDocumentDetails: PropTypes.func.isRequired,
};
