import React, { Component } from 'react';
import { Icon, Accordion } from 'semantic-ui-react';

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
    const { documentData } = this.props;
    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.toggleAccordion}
        >
          <Icon name="dropdown" />
          Abstract
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>{documentData.abstracts[0]}</p>
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
          {documentData.keywords.map(keyword => (
            <p key={keyword.keyword_pid}>{keyword.name}</p>
          ))}
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
          <p>{documentData.chapters[0]}</p>
        </Accordion.Content>
      </Accordion>
    );
  }
}
