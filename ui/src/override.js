import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wrap a React component and override props
 * Taken from https://github.com/indico/indico
 * @param Component the component to wrap
 * @param overrideProps the new props that will override or will be added to the wrapped component
 * @returns the wrapper component
 */
export function parametrize(Component, overrideProps) {
  const ParametrizedComponent = props => {
    // handle deferred prop calculation
    if (typeof extraProps === 'function') {
      overrideProps = overrideProps(props);
    }

    // Store the original component in an attribute
    if (Component.originalComponent) {
      Component = Component.originalComponent;
    }

    // extraProps override props if there is a name collision
    const { children, ...attrProps } = { ...props, ...overrideProps };
    return React.createElement(Component, attrProps, children);
  };

  const name = Component.displayName || Component.name;
  ParametrizedComponent.displayName = `Parametrized(${name})`;
  return ParametrizedComponent;
}

/**
 * Object responible of keeping track of all overridden components
 * @constructor object containing the initial map `id: Component` of overriden components
 */
class OverriddenComponentsStore {
  constructor(overriddenCmps) {
    this.components = overriddenCmps || {};
  }

  override = (id, Component) => {
    const alreadyOverridden = this.components.hasOwnProperty(id);
    if (alreadyOverridden) {
      throw Error(`The component ${id} has been already overridden.`);
    }
    this.components[id] = Component;
  };

  get = id => {
    return this.components[id];
  };
}
export const overrideStore = new OverriddenComponentsStore();

/**
 * React component to enable overriding children when rendering.
 * Taken from https://github.com/indico/indico
 */
export const Overridable = ({ id, children, ...restProps }) => {
  const child = React.Children.only(children); // throws an error if multiple children
  const childProps = child.props || {};
  const Overridden = overrideStore.get(id);

  return Overridden !== undefined
    ? // If there's an override, we replace the component's content with
      // the override + props
      React.createElement(Overridden, { ...childProps, ...restProps })
    : // No override? Clone the Overridable component's original children
    child
    ? React.cloneElement(child, childProps)
    : null;
};

/**
 * High Order Component to allow to entirely override a React component.
 * Taken from https://github.com/indico/indico
 */
export const overridable = (id, Component) => {
  const Overridden = ({ children, ...props }) => {
    const overriddenCmp = overrideStore.get(id);
    return React.createElement(
      overriddenCmp ? overriddenCmp : Component,
      props,
      children
    );
  };
  Overridden.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };
  Overridden.defaultProps = {
    children: null,
  };
  Overridden.displayName = `Overridable(${Component.displayName ||
    Component.name})`;
  Overridden.originalComponent = Component;
  return Overridden;
};
