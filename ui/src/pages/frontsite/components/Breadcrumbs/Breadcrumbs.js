import React, { Component } from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.elements = props.elements;
  }

  _renderBreadcrumbElements = () => {
    return this.elements.map((element, i, arr) => (
      <span key={i}>
        <Breadcrumb.Section>
          <Link key={element.to} to={element.to}>
            {element.label}
          </Link>
        </Breadcrumb.Section>
        {i + 1 !== arr.length ? (
          <Breadcrumb.Divider icon="right chevron" />
        ) : (
          <Breadcrumb.Divider icon="right arrow" />
        )}
      </span>
    ));
  };

  render() {
    return (
      <div className={'breadcrumbs'}>
        <Breadcrumb>
          {this._renderBreadcrumbElements()}
          <Breadcrumb.Section active>
            {this.props.currentElement}
          </Breadcrumb.Section>
        </Breadcrumb>
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  elements: PropTypes.array.isRequired,
  currentElement: PropTypes.node,
};
