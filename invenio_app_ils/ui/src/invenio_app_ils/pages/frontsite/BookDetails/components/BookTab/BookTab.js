import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import BookAccordion from './components/BookAccordion';
import BookTabMenu from './components/BookTabMenu';

export default class BookTab extends Component {
  render() {
    return (
      <Grid.Column width={13}>
        <Grid.Row>
          <Responsive
            as={BookTabMenu}
            {...Responsive.onlyComputer}
            data={this.props.data}
          />
          <Responsive
            as={BookAccordion}
            {...Responsive.onlyMobile}
            data={this.props.data}
          />
          <div className="ui hidden divider" />
        </Grid.Row>
      </Grid.Column>
    );
  }
}
