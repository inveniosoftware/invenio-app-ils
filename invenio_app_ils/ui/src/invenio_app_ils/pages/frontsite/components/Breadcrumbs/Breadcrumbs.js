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
    const lastElemIdx = this.elements.length - 1;
    return this.elements.map((element, i) => (
      <>
        <Breadcrumb.Section link>
          <Link key={element.to} to={element.to}>
            {element.label}
          </Link>
        </Breadcrumb.Section>
        {i !== lastElemIdx ? (
          <Breadcrumb.Divider icon="right chevron" />
        ) : (
          <Breadcrumb.Divider icon="right arrow" />
        )}
      </>
    ));
  };

  render() {
    return (
      <Breadcrumb>
        {this._renderBreadcrumbElements()}
        <Breadcrumb.Section active>
          {this.props.currentElement}
        </Breadcrumb.Section>
      </Breadcrumb>
    );
  }
}

Breadcrumbs.propTypes = {
  elements: PropTypes.array.isRequired,
  currentElement: PropTypes.node.isRequired,
};
