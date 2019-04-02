import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Message } from 'semantic-ui-react';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { DefaultFallbackComponent } from './DefaultFallbackComponent';

const isAPIError = error => {
  return _get(error, 'response.data.error_module') !== undefined;
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
      this.componentDidCatch = this._componentDidCatch;
    }
  }

  _componentDidCatch(error, info) {
    const { onUIError } = this.props;

    if (typeof onUIError === 'function') {
      onUIError.call(this, error, info);
    }

    this.setState({ error, info });
  }

  _renderErrorMessage(error) {
    let message = _get(error, 'response.data.message');
    if (!message) {
      message = _get(error, 'message');
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
    } else if (!_isEmpty(error) && shouldShowErrorPage(error)) {
      return this._renderErrorMessage(error);
    } else {
      return this.props.children;
    }
  }
}

Error.propTypes = {
  error: PropTypes.object,
  onUIError: PropTypes.func,
};
