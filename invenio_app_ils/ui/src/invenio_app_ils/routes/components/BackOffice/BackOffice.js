import React, {Component} from 'react';
import {Sidebar} from '../../../pages/backoffice';
import BackOfficeRoutesSwitch from './BackOfficeRoutesSwitch';
import {Notifications} from '../../../common/components/Notifications';
import {Container, Grid} from "semantic-ui-react";
import {Footer} from "../../../pages/backoffice";

export class BackOffice extends Component {
  render() {
    return (
      <Container fluid className="backoffice">
      <Grid columns={2} className="main">
        <Grid.Row stretched >
        <Grid.Column width={2}
                     className="bo-sidebar">
            <Sidebar/>
        </Grid.Column>
          <Grid.Column width={14} className="bo-content">
            <Notifications/>
            <Container fluid>
            <BackOfficeRoutesSwitch/>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
        <Footer/>
      </Container>
    );
  }
}
