import { Error, Loader, Pagination, ResultsTable } from '@components';
import { DocumentDetailsLink, InfoMessage } from '@pages/backoffice';
import { ExistingRelations } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/ExistingRelations';
import { RelationOtherModal } from '../RelationOther';
import { RelationRemover } from '../components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class RelationOther extends Component {
  constructor(props) {
    super(props);
  }

  viewDetails = ({ row }) => {
    return (
      <DocumentDetailsLink documentPid={row.pid}>
        {row.title}
      </DocumentDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { documentDetails } = this.props;

    if (!isEmpty(documentDetails)) {
      return (
        <RelationRemover
          referer={documentDetails}
          related={row}
          relationPayloadType="siblings"
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const other = relations['other'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type' },
      {
        title: 'Note',
        field: 'note',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationOtherModal relationType={'other'} />

          <ExistingRelations
            rows={other}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No relations'}
                content={'Use the button above to add relations.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationOther.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  documentDetails: PropTypes.object.isRequired,
};

RelationOther.defaultProps = {
  showMaxRows: 3,
};
