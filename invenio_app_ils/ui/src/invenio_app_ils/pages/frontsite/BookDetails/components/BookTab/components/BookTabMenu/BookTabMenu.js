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
            {this.props.data.keywords.map(keyword => (
              <p key={keyword.keyword_pid}>{keyword.name}</p>
            ))}
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
