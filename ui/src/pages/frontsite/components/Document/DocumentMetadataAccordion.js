import React, { Component } from 'react';
import { Accordion, Divider, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentRelations, DocumentInfo } from './index';
import { DocumentTableOfContent } from './DocumentTableOfContent';
import { DocumentConference } from './DocumentConference';

export class DocumentMetadataAccordion extends Component {
  constructor(props) {
    super(props);
    this.metadata = props.metadata;
  }

  state = { activeIndex: 'details' };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? '' : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 'details'}
          index={'details'}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'details'}>
          <DocumentRelations
            relations={this.metadata.relations}
            documentType={this.metadata.document_type}
          />
          <DocumentInfo metadata={this.metadata} />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'content'}
          index={'content'}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Content
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'content'}>
          <DocumentTableOfContent
            toc={this.metadata.table_of_content}
            abstract={this.metadata.abstract}
          />
          <DocumentInfo metadata={this.metadata} />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'publications'}
          index={'publications'}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Publications
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'publications'}>
          TODO
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'conference'}
          index={'conference'}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Conference
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'conference'}>
          <DocumentConference
            conference={this.metadata.conference_info}
            documentType={this.metadata.document_type}
          />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 'notes'}
          index={'notes'}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Notes
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 'notes'}>
          <Divider horizontal>Librarian's note</Divider>
          {this.metadata.note}
        </Accordion.Content>
      </Accordion>
    );
  }
}

DocumentMetadataAccordion.propTypes = {
  metadata: PropTypes.object.isRequired,
};
