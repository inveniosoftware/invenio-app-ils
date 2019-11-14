import React, { Component } from 'react';
import { Sidebar } from '@pages/backoffice';
import BackOfficeRoutesSwitch from './BackOfficeRoutesSwitch';
import { Notifications } from '@components/Notifications';

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
