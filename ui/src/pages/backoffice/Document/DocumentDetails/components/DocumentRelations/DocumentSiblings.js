import { Error, Loader } from '@components';
import { RelationMultipart, RelationSerial } from '.';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Label, Tab } from 'semantic-ui-react';

export default class DocumentSeries extends Component {
  render() {
    const { isLoading, error } = this.props;

    const languages = this.props.relations['language'] || [];

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
        render: () => <RelationMultipart />,
      },
      // {
      //   menuItem: {
      //     key: 'multipart',
      //     content: (
      //       <>
      //         Serials <Label>{serial.length}</Label>{' '}
      //       </>
      //     ),
      //   },
      //   render: () => <RelationSerial />,
      // },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab
            id="document-siblings"
            className="document-siblings"
            menu={{
              fluid: true,
              vertical: true,
            }}
            panes={panes}
          />
        </Error>
      </Loader>
    );
  }
}

DocumentSeries.propTypes = {
  relations: PropTypes.object.isRequired,
};
