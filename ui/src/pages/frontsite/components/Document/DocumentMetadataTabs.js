import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentRelations, DocumentInfo } from './index';
import { DocumentTableOfContent } from './DocumentTableOfContent';
import { DocumentConference } from './DocumentConference';
import { DocumentLinks } from './DocumentLinks';
import { Notes } from '../Notes';
import _get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Identifiers } from '../Identifiers';

export class DocumentMetadataTabs extends Component {
  constructor(props) {
    super(props);
    this.document = props.metadata;
  }

  renderTabPanes = () => {
    const panes = [
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
        menuItem: 'Identifiers',
        render: () => (
          <Tab.Pane attached={false}>
            <Identifiers
              identifiers={
                isEmpty(this.document.identifiers)
                  ? this.document.alternative_identifiers
                  : this.document.identifiers.concat(
                      this.document.alternative_identifiers
                    )
              }
            />
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
            <Notes content={this.document.note} />
          </Tab.Pane>
        ),
      },
    ];

    const { eitems } = this.document;
    if (_get(eitems, 'total', 0) > 0) {
      panes.push({
        menuItem: 'Files',
        render: () => (
          <Tab.Pane attached={false}>
            <DocumentLinks dividers eitems={eitems} />
          </Tab.Pane>
        ),
      });
    }
    return panes;
  };

  onTabChange = (event, { activeIndex }) => {
    this.props.showTab(activeIndex);
  };

  render() {
    return (
      <Tab
        activeIndex={this.props.activeTab}
        menu={{ secondary: true, pointing: true }}
        panes={this.renderTabPanes()}
        onTabChange={this.onTabChange}
        id="document-metadata-tabs"
      />
    );
  }
}

DocumentMetadataTabs.propTypes = {
  activeTab: PropTypes.number,
  metadata: PropTypes.object.isRequired,
};
