import React from 'react';
import PropTypes from 'prop-types';
import { AccordionField, ArrayField, GroupField } from '../core';
import { DeleteActionButton } from '../components';

export class ObjectArrayField extends React.Component {
  renderArrayItem = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        border
        widths="equal"
        action={
          <DeleteActionButton
            size="large"
            onClick={() => arrayHelpers.remove(indexPath)}
          />
        }
      >
        {this.props.objects.map(obj => {
          const ObjectField = obj.element;
          const objProps = obj.props || {};
          return (
            <ObjectField
              key={obj.key}
              fieldPath={`${objectPath}.${obj.key}`}
              {...objProps}
            />
          );
        })}
      </GroupField>
    );
  };

  renderArrayField = () => (
    <ArrayField
      fieldPath={this.props.fieldPath}
      label={this.props.accordion ? undefined : this.props.label}
      defaultNewValue={this.props.defaultNewValue}
      renderArrayItem={this.renderArrayItem}
      addButtonLabel={this.addButtonLabel}
    />
  );

  render() {
    if (this.props.accordion) {
      return (
        <AccordionField
          label={this.props.label}
          fieldPath={this.props.fieldPath}
          content={this.renderArrayField()}
        />
      );
    }

    return this.renderArrayField();
  }
}

ObjectArrayField.propTypes = {
  accordion: PropTypes.bool,
  addButtonLabel: PropTypes.string,
  defaultNewValue: PropTypes.object.isRequired,
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  objects: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      element: PropTypes.any.isRequired,
      props: PropTypes.object,
    })
  ).isRequired,
};

ObjectArrayField.defaultProps = {
  accordion: false,
  addButtonLabel: 'Add',
};
