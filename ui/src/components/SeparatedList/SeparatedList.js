import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export const SeparatedList = ({
  items,
  itemProps,
  prefix,
  separator,
  suffix,
  ...listProps
}) => {
  return (
    !isEmpty(items) && (
      <>
        {prefix}
        <List horizontal {...listProps}>
          {items.map((item, index) => (
            <List.Item key={index} {...itemProps}>
              {item}
              {index !== items.length - 1 && separator}
            </List.Item>
          ))}
        </List>
        {suffix}
      </>
    )
  );
};

SeparatedList.propTypes = {
  items: PropTypes.array.isRequired,
  prefix: PropTypes.node,
  separator: PropTypes.node.isRequired,
  suffix: PropTypes.node,
};

SeparatedList.defaultProps = {
  separator: ', ',
};
