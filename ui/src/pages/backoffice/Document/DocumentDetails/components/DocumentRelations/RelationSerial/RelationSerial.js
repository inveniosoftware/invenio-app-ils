import { Error, Loader } from '@components';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice';
import { ExistingRelations } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/ExistingRelations';

import { RelationRemover } from '../components';
import { RelationSerialModal } from '../RelationSerial';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class RelationSerial extends Component {
  viewDetails = ({ row }) => {
    return (
      <SeriesDetailsLink seriesPid={row.pid}>{row.title}</SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { documentDetails } = this.props;

    if (!isEmpty(documentDetails)) {
      return (
        <RelationRemover
          referer={documentDetails}
          related={row}
          buttonContent={'Remove from this serial'}
        />
      );
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const serial = relations['serial'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'publisher', field: 'publisher' },
      { title: 'Volume', field: 'volume' },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationSerialModal relationType={'serial'} />

          <ExistingRelations
            rows={serial}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No serials'}
                content={'Use the button above to add serial.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationSerial.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  documentDetails: PropTypes.object.isRequired,
};

RelationSerial.defaultProps = {
  showMaxRows: 3,
};
