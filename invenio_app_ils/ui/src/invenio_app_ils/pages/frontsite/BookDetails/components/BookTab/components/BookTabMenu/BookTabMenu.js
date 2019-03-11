import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';

export default class BookTabMenu extends Component {
  render() {
    const { data } = this.props;
    const panes = [
      {
        menuItem: 'Abstract',
        render: () => (
          <Tab.Pane>
            <p>{data.metadata.abstracts[0]}</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Information',
        render: () => (
          <Tab.Pane>
            {data.metadata.keywords.map(keyword => (
              <p key={keyword.keyword_pid}>{keyword.name}</p>
            ))}
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Chapters',
        render: () => (
          <Tab.Pane>
            <p>{data.metadata.chapters[0]}</p>
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
