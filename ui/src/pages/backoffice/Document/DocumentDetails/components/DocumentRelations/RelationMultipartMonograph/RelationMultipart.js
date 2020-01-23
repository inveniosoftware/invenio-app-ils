import { recordToPidType } from '@api/utils';
import { Error, Loader, Pagination, ResultsTable } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice';
import { RelationMultipartModal } from '../../DocumentRelations';
import { RelationRemover } from './../../DocumentRelations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup, Tab } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class RelationMultipart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 0,
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
          refererPid={documentDetails.metadata.pid}
          deletePayload={{
            parent_pid: row.pid,
            parent_pid_type: row.pid_type,
            child_pid: documentDetails.metadata.pid,
            child_pid_type: recordToPidType(documentDetails),
            relation_type: row.relation_type,
          }}
          buttonContent={'Remove from this multipart'}
        />
      );
    }
  };

  render() {
    const activePage = this.state.activePage;
    const { relations, showMaxRows, isLoading, error } = this.props;
    /* there will be always only one MM */
    const multipartMonograph = relations['multipart_monograph'] || {};

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type' },
      { title: 'Volume', field: 'volume' },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab.Pane>
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
          </Tab.Pane>
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
