import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';

import './BookTabs.css';

class BookTabs extends Component {
  render() {
    const panes = [
      {
        menuItem: 'Summary',
        render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>,
      },
      {
        menuItem: 'Information',
        render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
      },
      {
        menuItem: 'Chapters',
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
      },
    ];

    return (
      <div>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    );
  }
}

export default BookTabs;
