import { Error, Loader } from '@components';
import { RelationEdition } from '@pages/backoffice/components/Relations/RelationEdition';
import { RelationOther } from './RelationOther';
import { RelationLanguages } from './RelationLanguages';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Tab } from 'semantic-ui-react';

export default class DocumentSiblings extends Component {
  render() {
    const { isLoading, error, documentDetails } = this.props;

    const languages = this.props.relations['language'] || [];
    const editions = this.props.relations['edition'] || [];
    const other = this.props.relations['other'] || [];

    const panes = [
      {
        menuItem: {
          key: 'languages',
          content: (
            <>
              Languages <Label>{languages.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationLanguages />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'editions',
          content: (
            <>
              Editions <Label>{editions.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationEdition recordDetails={documentDetails} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'Other',
          content: (
            <>
              Other <Label>{other.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationOther />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab id="document-siblings" panes={panes} />
        </Error>
      </Loader>
    );
  }
}

DocumentSiblings.propTypes = {
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
};
