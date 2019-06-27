import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

export default class DocumentTabMenu extends Component {
  render() {
    const { documentMetadata } = this.props;
    const panes = [
      {
        menuItem: 'Abstract',
        render: () => (
          <Tab.Pane>
            {!isEmpty(documentMetadata.abstracts)
              ? documentMetadata.abstracts.map((abstract, index) => (
                  <p key={index}>{abstract}</p>
                ))
              : null}
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Information',
        render: () => (
          <Tab.Pane>
            {!isEmpty(documentMetadata.keywords)
              ? documentMetadata.keywords.map(keyword => (
                  <p key={keyword.keyword_pid}>{keyword.name}</p>
                ))
              : null}
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Chapters',
        render: () => (
          <Tab.Pane>
            {!isEmpty(documentMetadata.chapters)
              ? documentMetadata.chapters.map((chapter, index) => (
                  <p key={index}>{chapter}</p>
                ))
              : null}
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div>
        <Tab panes={panes} data-test={documentMetadata.document_pid} />
      </div>
    );
  }
}
