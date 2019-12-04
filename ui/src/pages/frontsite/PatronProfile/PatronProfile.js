import React, { Component } from 'react';
import { Container, Icon, Tab, Menu } from 'semantic-ui-react';
import { PatronMetadata } from './PatronMetadata';
import { PatronCurrentLoans } from './PatronCurrentLoans';
import { PatronPendingLoans } from './PatronPendingLoans';
import { PatronPastLoans } from './PatronPastLoans';
import { PatronCurrentDocumentRequests } from './PatronCurrentDocumentRequests';
import { PatronOverview } from './PatronOverview';
import { PatronPastDocumentRequests } from './PatronPastDocumentRequests';
import { UnAuthorized } from '@authentication/components/UnAuthorized';
import { AuthenticationGuard } from '@authentication/components/AuthenticationGuard';

export default class PatronProfile extends Component {
  renderHistory = () => {
    const currentUser = this.props.user;

    return (
      <Tab.Pane>
        <PatronPastLoans patronPid={currentUser.id} />
        <PatronPastDocumentRequests patronPid={currentUser.id} />
      </Tab.Pane>
    );
  };

  renderCurrent = () => {
    const currentUser = this.props.user;

    return (
      <Tab.Pane>
        <PatronCurrentLoans patronPid={currentUser.id} />
        <PatronPendingLoans patronPid={currentUser.id} />
        <PatronCurrentDocumentRequests patronPid={currentUser.id} />
      </Tab.Pane>
    );
  };

  tabs = () => {
    return [
      {
        menuItem: 'Current',
        render: () => this.renderCurrent(),
      },
      {
        menuItem: (
          <Menu.Item key={'history'}>
            History <Icon name={'history'} className={'float-right'} />
          </Menu.Item>
        ),
        render: () => this.renderHistory(),
      },
    ];
  };

  renderWhenAuthorised = () => {
    return (
      <Container className={'spaced'}>
        <PatronMetadata />
        <PatronOverview />
        <Tab
          menu={{ secondary: true, pointing: true }}
          panes={this.tabs()}
          className={'patron-profile-tab'}
        />
      </Container>
    );
  };

  render() {
    return (
      <AuthenticationGuard
        authorizedComponent={() => this.renderWhenAuthorised()}
        unAuthorizedComponent={UnAuthorized}
      />
    );
  }
}
