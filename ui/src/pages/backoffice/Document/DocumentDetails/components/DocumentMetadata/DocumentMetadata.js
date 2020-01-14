import { DocumentCopyrights } from './DocumentCopyrights';
import { DocumentMetadataGeneral } from './DocumentMetadataGeneral';
import { DocumentContents } from './DocumentContents';
import { DocumentExtras } from './DocumentExtras';
import { DocumentIdentifiers } from './DocumentIdentifiers';
import { DocumentSystemInfo } from './DocumentSystemInfo';
import React, { Component } from 'react';
import { Header, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

export default class DocumentMetadata extends Component {
  panes = () => {
    const document = this.props.documentDetails;

    let panes = [
      {
        menuItem: 'Metadata',
        render: () => (
          <Tab.Pane attached="bottom">
            <DocumentMetadataGeneral document={document} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Identifiers',
        render: () => (
          <Tab.Pane>
            <DocumentIdentifiers document={document} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Contents',
        render: () => (
          <Tab.Pane>
            <DocumentContents document={document} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Notes',
        render: () => (
          <Tab.Pane>
            <Header as="h3">Public note</Header>
            <p>{document.metadata.note}</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'System info',
        render: () => (
          <Tab.Pane>
            <DocumentSystemInfo document={document} />
          </Tab.Pane>
        ),
      },
    ];
    if (
      !isEmpty(document.metadata.copyrights) ||
      !isEmpty(document.metadata.licenses)
    ) {
      panes.push({
        menuItem: 'Copyrights & licenses',
        render: () => (
          <Tab.Pane>
            <DocumentCopyrights document={document} />
          </Tab.Pane>
        ),
      });
    }

    if (
      !isEmpty(document.metadata.publication_info) ||
      !isEmpty(document.metadata.conference_info) ||
      !isEmpty(document.metadata.extra_data)
    ) {
      panes.push({
        menuItem: 'Other',
        render: () => (
          <Tab.Pane>
            <DocumentExtras document={document} />
          </Tab.Pane>
        ),
      });
    }
    return panes;
  };

  render() {
    return (
      <Tab
        className="bo-metadata-tab mb-20"
        menu={{ attached: 'top' }}
        panes={this.panes()}
      />
    );
  }
}

DocumentMetadata.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
