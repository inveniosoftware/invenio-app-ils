import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Message } from 'semantic-ui-react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { DefaultFallbackComponent } from './DefaultFallbackComponent';

const isAPIError = error => {
  return get(error, 'response.data.message') !== undefined;
};

export const shouldShowErrorPage = error => {
  if (!isAPIError(error)) {
    return true;
  }

  return error.response.status !== 400;
};

export class Error extends Component {
  state = {
    error: null,
    info: null,
  };

  constructor(props) {
    super(props);

    if (props.boundary) {
      // NOTE: componentDidCatch is React internal and if it finds it it makes
      // it an error boundary.
      this.componentDidCatch = this.customComponentDidCatch;
    }
  }

  customComponentDidCatch(error, info) {
    const { onUIError } = this.props;

    if (typeof onUIError === 'function') {
      onUIError.call(this, error, info);
    }

    this.setState({ error, info });
  }

  renderErrorMessage(error) {
    let message = get(error, 'response.data.message');
    if (!message) {
      message = get(error, 'message');
      if (!message) {
        message = 'Unknown error';
      }
    }

    return (
      <Container>
        <Message negative header="Something went wrong" content={message} />
      </Container>
    );
  }

  render() {
    const { boundary, error, FallbackComponent } = this.props;
    const Fallback = FallbackComponent
      ? FallbackComponent
      : DefaultFallbackComponent;

    if (boundary && this.state.error) {
      return <Fallback {...this.state} />;
    } else if (!isEmpty(error) && shouldShowErrorPage(error)) {
      return this.renderErrorMessage(error);
    } else {
      return this.props.children;
    }
  }
}

Error.propTypes = {
  error: PropTypes.object,
  onUIError: PropTypes.func,
};
