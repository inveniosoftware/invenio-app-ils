import React, { Component } from 'react';
import { Placeholder } from 'semantic-ui-react';

export class ILSParagraphPlaceholder extends Component {
  renderLines = () => {
    const lines = [];
    for (let i = 0; i < this.props.linesNumber; i++) {
      lines.push(
        <Placeholder.Line
          length={this.props.lineLength ? this.props.lineLength : 'full'}
        />
      );
    }
    return lines;
  };

  render() {
    const { isLoading, linesNumber, ...restParams } = this.props;
    return isLoading ? (
      <Placeholder {...restParams}>{this.renderLines()}</Placeholder>
    ) : (
      this.props.children
    );
  }
}

export class ILSImagePlaceholder extends Component {
  render() {
    const { isLoading, ...restParams } = this.props;
    return isLoading ? (
      <Placeholder {...restParams}>
        <Placeholder.Image />
      </Placeholder>
    ) : (
      this.props.children
    );
  }
}

export class ILSHeaderPlaceholder extends Component {
  render() {
    const { isLoading, image, ...restParams } = this.props;
    return isLoading ? (
      <Placeholder {...restParams}>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    ) : (
      this.props.children
    );
  }
}
