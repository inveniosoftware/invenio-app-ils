import { Error, Loader, ResultsTable } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import { RelationRemover } from '@pages/backoffice/components/Relations';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { RelationMultipartModal } from '../RelationMultipartMonograph';

export default class RelationMultipart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    };
  }

  viewDetails = ({ row }) => {
    return (
      <SeriesDetailsLink seriesPid={row.pid} data-test={row.pid}>
        {row.title}
      </SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { documentDetails } = this.props;

    if (!isEmpty(documentDetails)) {
      return (
        <RelationRemover
          referrer={documentDetails}
          related={row}
          buttonContent={'Remove from this multipart'}
        />
      );
    }
  };

  render() {
    const activePage = this.state.activePage;
    const { relations, showMaxRows, isLoading, error } = this.props;
    /* there will be always only one MM */
    const multipartMonograph = relations['multipart_monograph'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'publisher', field: 'publisher' },
      { title: 'Volume', field: 'volume' },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationMultipartModal
            relationType={'multipart_monograph'}
            disabled={!isEmpty(multipartMonograph)}
          />

          {!isEmpty(multipartMonograph) && (
            <Popup
              content={
                'Unlink this document from the multipart monograph below to add another one. Only one allowed at a time.'
              }
              trigger={<Icon name="question circle" />}
            />
          )}
          <ResultsTable
            data={multipartMonograph}
            columns={columns}
            totalHitsCount={multipartMonograph.length}
            showMaxRows={showMaxRows}
            currentPage={activePage}
            renderEmptyResultsElement={() => (
              <InfoMessage
                header={'No multipart attached'}
                content={
                  'Use the button above to attach this document to a multipart monograph.'
                }
              />
            )}
          />
        </Error>
      </Loader>
    );
  }
}

RelationMultipart.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  documentDetails: PropTypes.object.isRequired,
};

RelationMultipart.defaultProps = {
  showMaxRows: 3,
};
