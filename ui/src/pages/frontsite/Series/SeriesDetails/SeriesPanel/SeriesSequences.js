import React, { Component } from 'react';
import { Header, List, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FrontSiteRoutes } from '@routes/urls';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

export default class SeriesSequences extends Component {
  renderSequenceLinks = sequences => {
    return (
      <>
        <List>
          {sequences.map((sequence, idx) => (
            <List.Item key={idx}>
              <List.Content>
                <Link to={FrontSiteRoutes.seriesDetailsFor(sequence.pid)}>
                  {sequence.title}
                </Link>
              </List.Content>
            </List.Item>
          ))}
        </List>{' '}
      </>
    );
  };

  render() {
    const { relations } = this.props;
    if (
      isEmpty(relations) ||
      (isEmpty(relations.next) && isEmpty(relations.previous))
    )
      return null;

    return (
      <Segment>
        <Header size="small">Read more</Header>
        {!isEmpty(relations.next) && (
          <>
            This series is continued by:
            {this.renderSequenceLinks(relations.next)}
          </>
        )}
        {!isEmpty(relations.previous) && (
          <>
            This series continues the following:
            {this.renderSequenceLinks(relations.previous)}
          </>
        )}
      </Segment>
    );
  }
}

SeriesSequences.propTypes = {
  relations: PropTypes.object,
};
