import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header } from 'semantic-ui-react';
import { SeriesAccessUrls } from '.';

const scrollToRef = (event, ref) => {
  ref.current.scrollIntoView(false, { behaviour: 'smooth' });
  event.preventDefault();
};

export const SeriesAccess = ({ anchors }) => {
  return (
    <Segment className="highlighted">
      <Header as="h3">Access online</Header>
      <SeriesAccessUrls truncate />
      <br />
      It's not possible to loan an entire series but individual volumes can be
      loaned from the library. Please see the list of available volumes{' '}
      <a
        href="#literature"
        onClick={event => scrollToRef(event, anchors.literature)}
      >
        below
      </a>
      .
    </Segment>
  );
};

SeriesAccess.propTypes = {
  metadata: PropTypes.object,
};
