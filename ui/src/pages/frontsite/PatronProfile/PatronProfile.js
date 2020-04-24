import { AuthenticationGuard } from '@authentication/components/AuthenticationGuard';
import React, { Component } from 'react';
import { Container, Header, Icon, Menu, Tab } from 'semantic-ui-react';
import { PatronCurrentDocumentRequests } from './PatronCurrentDocumentRequests';
import { PatronCurrentLoans } from './PatronCurrentLoans';
import { PatronOverview } from './PatronOverview';
import { PatronPastDocumentRequests } from './PatronPastDocumentRequests';
import { PatronPastLoans } from './PatronPastLoans';
import { PatronPendingLoans } from './PatronPendingLoans';

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
        <Header as="h2">Your activity</Header>
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
      />
    );
  }
}
