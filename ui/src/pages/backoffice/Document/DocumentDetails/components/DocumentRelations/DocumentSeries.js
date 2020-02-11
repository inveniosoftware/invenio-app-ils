import { Error, Loader } from '@components';
import { RelationSerial } from '@pages/backoffice/components/Relations/RelationSerial';
// import { RelationSerial } from './RelationSerial';
import { RelationMultipart } from './RelationMultipartMonograph';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Tab } from 'semantic-ui-react';

export default class DocumentSeries extends Component {
  render() {
    const { isLoading, error, documentDetails } = this.props;

    const multipart = this.props.relations['multipart_monograph'] || [];
    const serial = this.props.relations['serial'] || [];

    const panes = [
      {
        menuItem: {
          key: 'multipart',
          content: (
            <>
              Multipart monograph <Label>{multipart.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationMultipart />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'series',
          content: (
            <>
              Serials <Label>{serial.length}</Label>{' '}
            </>
          ),
        },
        render: () => (
          <Tab.Pane className="bo-relations-tab">
            <RelationSerial recordDetails={documentDetails} />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab id="document-series" panes={panes} />
        </Error>
      </Loader>
    );
  }
}

DocumentSeries.propTypes = {
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};
