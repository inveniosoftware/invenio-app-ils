import React, { Component } from 'react';
import { Header, Sidebar } from '../../../pages/backoffice';
import BackOfficeRoutesSwitch from './BackOfficeRoutesSwitch';
import { Notifications } from '../../../common/components/Notifications';
import { Container, Grid } from 'semantic-ui-react';

const sidebarStyle = {
  minHeight: '100%',
  backgroundColor: '#eee',
  paddingLeft: '2%',
};

const contentStyle = {
  paddingRight: '2%',
};

export class BackOffice extends Component {
  render() {
    return (
      <Container fluid>
        <Header />
        <Notifications />
        <Grid>
          {/* Sidebar */}
          <Grid.Column width={3} style={sidebarStyle}>
            <Sidebar />
          </Grid.Column>

          {/* Content */}
          <Grid.Column
            stretched
            width={13}
            style={contentStyle}
            verticalAlign={'top'}
          >
            <BackOfficeRoutesSwitch />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
