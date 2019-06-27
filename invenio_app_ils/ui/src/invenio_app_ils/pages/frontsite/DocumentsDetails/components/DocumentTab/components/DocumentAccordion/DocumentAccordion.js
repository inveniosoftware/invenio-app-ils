import React, { Component } from 'react';
import { Icon, Accordion } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

export default class DocumentAccordion extends Component {
  state = { activeIndex: 0 };

  toggleAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const { documentMetadata } = this.props;
    return (
      <Accordion fluid styled data-test={documentMetadata.document_pid}>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.toggleAccordion}
        >
          <Icon name="dropdown" />
          Abstract
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {!isEmpty(documentMetadata.abstracts)
            ? documentMetadata.abstracts.map((abstract, index) => (
                <p key={index}>{abstract}</p>
              ))
            : null}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.toggleAccordion}
        >
          <Icon name="dropdown" />
          Information
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {!isEmpty(documentMetadata.keywords)
            ? documentMetadata.keywords.map(keyword => (
                <p key={keyword.keyword_pid}>{keyword.name}</p>
              ))
            : null}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.toggleAccordion}
        >
          <Icon name="dropdown" />
          Chapters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          {!isEmpty(documentMetadata.chapters)
            ? documentMetadata.chapters.map((chapter, index) => (
                <p key={index}>{chapter}</p>
              ))
            : null}
        </Accordion.Content>
      </Accordion>
    );
  }
}
