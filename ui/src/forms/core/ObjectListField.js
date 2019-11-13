import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form, List, Icon } from 'semantic-ui-react';
import { ErrorIcon } from './ErrorIcon';

export class ObjectListField extends Component {
  state = {
    activeIndex: null,
  };

  onItemClick = (item, index) => {
    if (index === this.state.activeIndex) {
      index = null;
      item = null;
    }
    this.setState({ activeIndex: index });
    if (this.props.onItemChange) {
      this.props.onItemChange(index, item);
    }
  };

  getListItemIcon = (index, errors) => {
    for (const errorPath in errors) {
      if (errorPath.startsWith(`${this.props.fieldPath}.${index}`)) {
        return <ErrorIcon />;
      }
    }
    return <Icon name="list" />;
  };

  renderFormField = props => {
    const { fieldPath, keyField } = this.props;
    const {
      form: { errors, values },
    } = props;
    const items = getIn(values, fieldPath, []);
    const { activeIndex } = this.state;

    return (
      <Form.Field className="object-list-field">
        <label>Authors</label>
        <List horizontal divided relaxed>
          {items.map((item, index) => (
            <List.Item
              key={index}
              as="a"
              active={activeIndex === index}
              onClick={() => this.onItemClick(item, index)}
            >
              <List.Content>
                {this.getListItemIcon(index, errors)}
                {item[keyField]}
              </List.Content>
            </List.Item>
          ))}

          <List.Item
            as="a"
            active={activeIndex === items.length}
            onClick={() => this.onItemClick(null, items.length)}
          >
            <List.Content>
              <Icon name="add" />
              New author
            </List.Content>
          </List.Item>
        </List>
      </Form.Field>
    );
  };

  render() {
    return (
      <Field name={this.props.fieldPath} component={this.renderFormField} />
    );
  }
}

ObjectListField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  onItemChange: PropTypes.func,
};
