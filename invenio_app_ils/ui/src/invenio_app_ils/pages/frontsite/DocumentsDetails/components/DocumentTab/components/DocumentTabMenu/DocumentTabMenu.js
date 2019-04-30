import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';

export default class DocumentTabMenu extends Component {
  render() {
    const { documentData } = this.props;
    const panes = [
      {
        menuItem: 'Abstract',
        render: () => (
          <Tab.Pane>
            <p>{documentData.abstracts[0]}</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Information',
        render: () => (
          <Tab.Pane>
            {documentData.keywords.map(keyword => (
              <p key={keyword.keyword_pid}>{keyword.name}</p>
            ))}
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Chapters',
        render: () => (
          <Tab.Pane>
            <p>{documentData.chapters[0]}</p>
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
