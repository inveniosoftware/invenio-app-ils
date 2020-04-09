import { Error, Loader, ResultsTable } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import { RelationRemover } from '@pages/backoffice/components/Relations';
import { DocumentTitle } from '@components/Document';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { RelationMultipartModal } from '../RelationMultipartMonograph';

export default class RelationMultipart extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'multipart_monograph';
    this.state = {
      activePage: 1,
    };
  }

  viewDetails = ({ row }) => {
    return (
      <SeriesDetailsLink pidValue={row.pid_value}>
        <DocumentTitle metadata={row.record_metadata} />
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
          relationType={row.relation_type}
          buttonContent={'Remove from this multipart'}
        />
      );
    }
  };

  render() {
    const activePage = this.state.activePage;
    const { relations, showMaxRows, isLoading, error } = this.props;
    /* there will be always only one MM */
    const multipartMonograph = relations[this.relationType] || [];

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Volume', field: 'volume' },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationMultipartModal
            relationType={this.relationType}
            disabled={!isEmpty(multipartMonograph)}
          />

          {!isEmpty(multipartMonograph) && (
            <Popup
              content={
                'A document can be attached only to one multipart monotgraph. Remove the existing relation to add a new one.'
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
  showMaxRows: PropTypes.number,
};

RelationMultipart.defaultProps = {
  showMaxRows: 3,
};
