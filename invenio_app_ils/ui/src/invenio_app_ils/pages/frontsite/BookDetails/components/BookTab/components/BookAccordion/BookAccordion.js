import React, { Component } from 'react';
import { Icon, Accordion } from 'semantic-ui-react';

export default class BookAccordion extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const { data } = this.props;
    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Abstract
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>{data.metadata.abstracts[0]}</p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Information
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {data.metadata.keywords.map(keyword => (
            <p key={keyword.keyword_pid}>{keyword.name}</p>
          ))}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Chapters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>{data.metadata.chapters[0]}</p>
        </Accordion.Content>
      </Accordion>
    );
  }
}
