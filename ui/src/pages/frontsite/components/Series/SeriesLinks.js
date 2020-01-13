import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { EmptyMessage } from '@components';
import { SeriesAccessUrls, SeriesUrls } from '.';

export const SeriesLinks = ({ metadata }) => {
  return (
    <EmptyMessage
      show={!(isEmpty(metadata.access_urls) && isEmpty(metadata.urls))}
      message="There are no links for this series."
    >
      <Divider horizontal>Access online</Divider>
      <SeriesAccessUrls />
      <Divider horizontal>Links</Divider>
      <SeriesUrls />
    </EmptyMessage>
  );
};

SeriesLinks.propTypes = {
  metadata: PropTypes.object,
};
