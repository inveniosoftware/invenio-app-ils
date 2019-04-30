import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { DocumentsDetails } from './components';

export default class DocumentsDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentsDetails = this.props.fetchDocumentsDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.documentPid) {
        this.fetchDocumentsDetails(location.state.documentPid);
      }
    });
    this.fetchDocumentsDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Container>
        <DocumentsDetails />
      </Container>
    );
  }
}

DocumentsDetailsContainer.propTypes = {
  fetchDocumentsDetails: PropTypes.func.isRequired,
};
