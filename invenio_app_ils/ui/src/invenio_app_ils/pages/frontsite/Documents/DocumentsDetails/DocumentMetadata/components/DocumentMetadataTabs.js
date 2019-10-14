import React, { Component } from 'react';
import { Divider, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentRelations, DocumentInfo } from './index';
import { DocumentTableOfContent } from './DocumentTableOfContent';
import { DocumentConference } from './DocumentConference';

export class DocumentMetadataTabs extends Component {
  constructor(props) {
    super(props);
    this.document = props.metadata;
  }

  renderTabPanes = () => {
    return [
      {
        menuItem: 'Details',
        render: () => (
          <Tab.Pane attached={false}>
            <DocumentRelations
              relations={this.document.relations}
              documentType={this.document.document_type}
            />
            <DocumentInfo metadata={this.document} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Content',
        render: () => (
          <Tab.Pane attached={false}>
            <DocumentTableOfContent
              toc={this.document.table_of_content}
              abstract={this.document.abstract}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Publications',
        render: () => (
          <Tab.Pane attached={false}>We wait for the schema!</Tab.Pane>
        ),
      },
      {
        menuItem: 'Conference',
        render: () => (
          <Tab.Pane attached={false}>
            <DocumentConference
              conference={this.document.conference_info}
              documentType={this.document.document_type}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Notes',
        render: () => (
          <Tab.Pane attached={false}>
            <Divider horizontal>Librarian's note</Divider>
            {this.document.note}
          </Tab.Pane>
        ),
      },
    ];
  };

  render() {
    return (
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={this.renderTabPanes()}
      />
    );
  }
}

DocumentMetadataTabs.propTypes = {
  metadata: PropTypes.object.isRequired,
};
