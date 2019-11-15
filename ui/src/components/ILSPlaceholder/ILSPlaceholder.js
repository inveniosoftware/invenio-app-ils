import React, { Component } from 'react';
import { Item, Placeholder } from 'semantic-ui-react';

export class ILSParagraphPlaceholder extends Component {
  renderLines = () => {
    const lines = [];
    for (let i = 0; i < this.props.linesNumber; i++) {
      lines.push(
        <Placeholder.Line
          key={i}
          length={this.props.lineLength ? this.props.lineLength : 'full'}
        />
      );
    }
    return lines;
  };

  render() {
    const { isLoading, linesNumber, renderElement, ...restParams } = this.props;
    return isLoading ? (
      <Placeholder {...restParams}>{this.renderLines()}</Placeholder>
    ) : this.props.children ? (
      this.props.children
    ) : null;
  }
}

export class ILSImagePlaceholder extends Component {
  render() {
    const { isLoading, renderElement, ...restParams } = this.props;
    return isLoading ? (
      <Placeholder {...restParams}>
        <Placeholder.Image />
      </Placeholder>
    ) : this.props.children ? (
      this.props.children
    ) : null;
  }
}

export class ILSHeaderPlaceholder extends Component {
  render() {
    const { isLoading, image, renderElement, ...restParams } = this.props;
    return isLoading ? (
      <Placeholder {...restParams}>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    ) : this.props.children ? (
      this.props.children
    ) : null;
  }
}

export class ILSItemPlaceholder extends Component {
  render() {
    const { isLoading, style, ...restParams } = this.props;
    return isLoading ? (
      <Item>
        <Item.Content>
          <Item.Description>
            <ILSParagraphPlaceholder
              isLoading={isLoading}
              linesNumber={4}
              {...restParams}
            />
          </Item.Description>
        </Item.Content>
      </Item>
    ) : this.props.children ? (
      this.props.children
    ) : null;
  }
}
