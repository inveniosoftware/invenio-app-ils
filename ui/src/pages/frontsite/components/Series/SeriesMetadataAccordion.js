import React, { Component } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  SeriesAllTitles,
  SeriesInfo,
  SeriesAlternativeTitles,
  SeriesLinks,
} from './';
import { Identifiers } from '../Identifiers';
import { Notes } from '../Notes';

export class SeriesMetadataAccordion extends Component {
  state = { activeIndex: 'details' };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? '' : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { metadata } = this.props;
    const { activeIndex } = this.state;
    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 'details'}
          index="details"
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'details'}>
          <SeriesInfo metadata={metadata} />
          <SeriesAlternativeTitles metadata={metadata} />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'identifiers'}
          index="identifiers"
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Identifiers
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'identifiers'}>
          <Identifiers identifiers={metadata.identifiers} />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'titles'}
          index="titles"
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Titles
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'titles'}>
          <SeriesAllTitles />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'notes'}
          index="notes"
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Notes
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'notes'}>
          <Notes content={metadata.note} />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'links'}
          index="links"
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Links
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'links'}>
          <SeriesLinks />
        </Accordion.Content>
      </Accordion>
    );
  }
}

SeriesMetadataAccordion.propTypes = {
  metadata: PropTypes.object.isRequired,
};
