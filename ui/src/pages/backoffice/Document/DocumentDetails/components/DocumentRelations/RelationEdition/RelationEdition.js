import { Error, Loader } from '@components';
import {
  DocumentDetailsLink,
  InfoMessage,
  SeriesDetailsLink,
} from '@pages/backoffice';
import { ExistingRelations } from '../components/';
import { RelationEditionModal } from '../RelationEdition';
import { RelationRemover } from '../components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class RelationEdition extends Component {
  constructor(props) {
    super(props);
  }

  viewDetails = ({ row }) => {
    if (row.pid_type === 'docid')
      return (
        <DocumentDetailsLink documentPid={row.pid}>
          {row.title}
        </DocumentDetailsLink>
      );
    else if (row.pid_type === 'serid') {
      return (
        <SeriesDetailsLink seriesPid={row.pid}>{row.title}</SeriesDetailsLink>
      );
    }
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
    const editions = relations['edition'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type' },
      {
        title: 'Edition',
        field: 'edition',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationEditionModal relationType={'edition'} />

          <ExistingRelations
            rows={editions}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No related editions'}
                content={'Use the button above to add related edition.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationEdition.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  documentDetails: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number.isRequired,
};

RelationEdition.defaultProps = {
  showMaxRows: 3,
};
