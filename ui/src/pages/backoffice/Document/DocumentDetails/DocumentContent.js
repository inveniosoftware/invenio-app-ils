import {
  DocumentEItems,
  DocumentItems,
  DocumentPendingLoans,
  DocumentStats,
} from '@pages/backoffice/Document/DocumentDetails/components';
import {
  DocumentSeries,
  DocumentSiblings,
} from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations';
import React, { Component } from 'react';
import { Accordion } from 'semantic-ui-react';

export class DocumentContent extends Component {
  render() {
    const { anchors } = this.props;
    const panels = [
      {
        key: 'loan-requests',
        title: 'Loan requests',
        content: (
          <Accordion.Content>
            <div ref={anchors.loanRequestsRef} id="loan-requests">
              <DocumentPendingLoans />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-items',
        title: 'Physical items',
        content: (
          <Accordion.Content>
            <div ref={anchors.attachedItemsRef} id="document-items">
              <DocumentItems />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-eitems',
        title: 'Electronic items',
        content: (
          <Accordion.Content>
            <div ref={anchors.attachedEItemsRef} id="document-eitems">
              <DocumentEItems />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-series',
        title: 'Series',
        content: (
          <Accordion.Content>
            <div ref={anchors.seriesRef} id="document-series">
              <DocumentSeries />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-siblings',
        title: 'Related',
        content: (
          <Accordion.Content>
            <div ref={anchors.relatedRef} id="document-siblings">
              <DocumentSiblings />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'document-statistics',
        title: 'Statistics',
        content: (
          <Accordion.Content>
            <div ref={anchors.statisticsRef} id="document-statistics">
              <DocumentStats />
            </div>
          </Accordion.Content>
        ),
      },
    ];
    const defaultIndexes = [0, 1, 3];

    return (
      <Accordion
        fluid
        styled
        className="highlighted"
        panels={panels}
        exclusive={false}
        defaultActiveIndex={defaultIndexes}
      />
    );
  }
}
