import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import DocumentAccordion from './components/DocumentAccordion';
import DocumentTabMenu from './components/DocumentTabMenu';

export default class DocumentTab extends Component {
  render() {
    return (
      <Grid.Column width={13}>
        <Grid.Row>
          <Responsive
            as={DocumentTabMenu}
            {...Responsive.onlyComputer}
            documentMetadata={this.props.documentMetadata}
          />
          <Responsive
            as={DocumentAccordion}
            {...Responsive.onlyMobile}
            documentMetadata={this.props.documentMetadata}
          />
          <div className="ui hidden divider" />
        </Grid.Row>
      </Grid.Column>
    );
  }
}
