import React, { Component } from 'react';
import {
  Icon,
  Accordion,
  Segment,
  Menu,
  Grid,
  Responsive,
} from 'semantic-ui-react';

class BookAccordion extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

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
          <p>{this.props.data.abstracts[0]}</p>
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
          <p>
            There are many breeds of dogs. Each breed varies in size and
            temperament. Owners often select a breed of dog that they find to be
            compatible with their own lifestyle and desires from a companion.
          </p>
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
          <p>
            Three common ways for a prospective owner to acquire a dog is from
            pet shops, private owners, or shelters. A pet shop may be the most
            convenient way to buy a dog. Buying a dog from a private owner
            allows you to assess the pedigree and upbringing of your dog before
            choosing to take it home. Lastly, finding your dog from a shelter,
            helps give a good home to a dog who may not find one so readily.
          </p>
        </Accordion.Content>
      </Accordion>
    );
  }
}

class BookTabMenu extends Component {
  state = { activeItem: 'abstract' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu attached="top" tabular>
          <Menu.Item
            name="abstract"
            active={activeItem === 'abstract'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="information"
            active={activeItem === 'information'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="chapters"
            active={activeItem === 'chapters'}
            onClick={this.handleItemClick}
          />
        </Menu>

        <Segment attached="bottom">
          <p>{this.props.data.abstracts[0]}</p>
        </Segment>
      </div>
    );
  }
}

export default class BookTab extends Component {
  state = { activeItem: 'abstract' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Grid.Column width={13}>
        <Grid.Row>
          <Responsive as={BookTabMenu} minWidth={768} data={this.props.data} />
          <Responsive
            as={BookAccordion}
            maxWidth={768}
            data={this.props.data}
          />
          <div className="ui hidden divider" />
        </Grid.Row>
      </Grid.Column>
    );
  }
}
