import React, { Component } from 'react';
import { Container, Icon, Tab, Menu } from 'semantic-ui-react';
import { PatronMetadata } from './PatronMetadata';
import { PatronCurrentLoans } from './PatronCurrentLoans';
import { PatronPendingLoans } from './PatronPendingLoans';
import { PatronPastLoans } from './PatronPastLoans';
import { PatronCurrentDocumentRequests } from './PatronCurrentDocumentRequests';
import { PatronCurrentBorrowingRequests } from './PatronCurrentBorrowingRequests';
import { PatronOverview } from './PatronOverview';
import { PatronPastDocumentRequests } from './PatronPastDocumentRequests';
import { UnAuthorized } from '@authentication/components/UnAuthorized';
import { AuthenticationGuard } from '@authentication/components/AuthenticationGuard';

export default class PatronProfile extends Component {
  tabs = () => {
    const currentUser = this.props.user;
    return [
      {
        menuItem: 'Current',
        render: () => (
          <Tab.Pane>
            <PatronCurrentLoans patronPid={currentUser.id} />
            <PatronPendingLoans patronPid={currentUser.id} />
            <PatronCurrentBorrowingRequests patronPid={currentUser.id} />
            <PatronCurrentDocumentRequests patronPid={currentUser.id} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key={'history'}>
            History <Icon name={'history'} className={'float-right'} />
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <PatronPastLoans patronPid={currentUser.id} />
            <PatronPastDocumentRequests patronPid={currentUser.id} />
          </Tab.Pane>
        ),
      },
    ];
  };

  renderWhenAuthorised = () => {
    return (
      <Container className={'spaced'}>
        <PatronMetadata />
        <PatronOverview />
        <Tab
          menu={{ secondary: true, pointing: true, size: 'huge' }}
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
