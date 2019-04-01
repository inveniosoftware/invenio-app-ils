import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';

export default class BookTabMenu extends Component {
  render() {
    const panes = [
      {
        menuItem: 'Abstract',
        render: () => (
          <Tab.Pane>
            <p>{this.props.data.abstracts[0]}</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Information',
        render: () => (
          <Tab.Pane>
            <p>{this.props.data.keywords}</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Chapters',
        render: () => (
          <Tab.Pane>
            <p>{this.props.data.chapters[0]}</p>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div>
        <Tab panes={panes} />
      </div>
    );
  }
}
