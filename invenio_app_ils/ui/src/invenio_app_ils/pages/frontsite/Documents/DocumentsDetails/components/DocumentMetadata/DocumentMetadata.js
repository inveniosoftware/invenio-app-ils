import React, { Component } from 'react';
import { Grid, Segment, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentTags, DocumentRelations, DocumentInfo } from './components';

export default class DocumentMetadata extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentsDetails;
  }

  renderTabPanes = () => {
    return [
      {
        menuItem: 'Details',
        render: () => (
          <Tab.Pane attached={false}>
            <DocumentRelations relations={this.document.metadata.relations} />
            <DocumentInfo metadata={this.document.metadata} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Content',
        render: () => (
          <Tab.Pane attached={false}>We wait for the schema!</Tab.Pane>
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
          <Tab.Pane attached={false}>We wait for the schema!</Tab.Pane>
        ),
      },
      {
        menuItem: 'Notes',
        render: () => (
          <Tab.Pane attached={false}>
            {this.document.metadata.notes[0].value}
          </Tab.Pane>
        ),
      },
    ];
  };

  render() {
    return (
      <Segment
        className="document-metadata"
        data-test={this.document.metadata.pid}
      >
        <Grid>
          <Grid.Row>
            <Grid stackable columns={1}>
              <Grid.Column width={16}>
                <DocumentTags tags={this.document.metadata.tags} />
                <br />
                <br />
                <Tab
                  menu={{ secondary: true, pointing: true }}
                  panes={this.renderTabPanes()}
                />
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentMetadata.propTypes = {
  documentsDetails: PropTypes.object.isRequired,
};
