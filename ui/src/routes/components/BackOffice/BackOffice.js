import { Notifications } from '@components/Notifications';
import { Sidebar } from '@pages/backoffice/components/Sidebar';
import React, { Component } from 'react';
import BackOfficeRoutesSwitch from './BackOfficeRoutesSwitch';

export class BackOffice extends Component {
  render() {
    return (
      <div className="backoffice">
        <div className="bo-sidebar">
          <Sidebar />
        </div>
        <div className="bo-content">
          <Notifications />
          <BackOfficeRoutesSwitch />
        </div>
      </div>
    );
  }
}
