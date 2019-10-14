import React, { Component } from 'react';
import { Container, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentMetadataAccordion, DocumentMetadataTabs } from './components';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentDetails;
  }

  render() {
    return (
      <Container
        className="document-metadata"
        data-test={this.document.metadata.pid}
      >
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <DocumentMetadataTabs />
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <DocumentMetadataAccordion />
        </Responsive>
      </Container>
    );
  }
}

DocumentMetadata.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
