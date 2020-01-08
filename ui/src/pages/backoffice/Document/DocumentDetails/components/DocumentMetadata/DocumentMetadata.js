import { DocumentCopyrights } from './DocumentCopyrights';
import { DocumentMetadataGeneral } from './DocumentMetadataGeneral';
import { DocumentContents } from './DocumentContents';
import { DocumentExtras } from './DocumentExtras';
import { DocumentIdentifiers } from './DocumentIdentifiers';
import { DocumentSystemInfo } from './DocumentSystemInfo';
import React, { Component } from 'react';
import { Header, Segment, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

export default class DocumentMetadata extends Component {
  panes = () => {
    const document = this.props.documentDetails;

    let panes = [
      {
        menuItem: 'General',
        render: () => <DocumentMetadataGeneral document={document} />,
      },
      {
        menuItem: 'Identifiers',
        render: () => <DocumentIdentifiers document={document} />,
      },
      {
        menuItem: 'Contents',
        render: () => <DocumentContents document={document} />,
      },
      {
        menuItem: 'Notes',
        render: () => (
          <Segment>
            <Header as="h3">Public note</Header>
            <p>{document.metadata.note}</p>
          </Segment>
        ),
      },
      {
        menuItem: 'System info',
        render: () => <DocumentSystemInfo document={document} />,
      },
    ];
    if (
      !isEmpty(document.metadata.copyrights) ||
      !isEmpty(document.metadata.licenses)
    ) {
      panes.push({
        menuItem: 'Copyrights & licenses',
        render: () => <DocumentCopyrights document={document} />,
      });
    }

    if (
      !isEmpty(document.metadata.publication_info) ||
      !isEmpty(document.metadata.conference_info) ||
      !isEmpty(document.metadata.extra_data)
    ) {
      panes.push({
        menuItem: 'Other',
        render: () => <DocumentExtras document={document} />,
      });
    }
    return panes;
  };

  render() {
    return (
      <Tab
        className="bo-metadata-tab"
        menu={{ secondary: true, pointing: true }}
        panes={this.panes()}
      />
    );
  }
}

DocumentMetadata.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
