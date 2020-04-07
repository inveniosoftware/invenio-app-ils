import { LiteratureRelations } from '@pages/frontsite/components';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import { Identifiers } from '../Identifiers';
import { Notes } from '../Notes';
import { DocumentConference } from './DocumentConference';
import { DocumentLinks } from './DocumentLinks';
import { DocumentTableOfContent } from './DocumentTableOfContent';
import { DocumentInfo } from './index';

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
            <LiteratureRelations relations={this.document.relations} />
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
                _isEmpty(this.document.identifiers)
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
