import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { Accordion, Form, Icon, Segment } from 'semantic-ui-react';

export class AccordionField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
    this.required = props.required;
    this.uiProps = props.uiProps;
    this.state = { active: false };
    this.iconActive = (
      <Icon
        name="angle down"
        color="orange"
        size="large"
        style={{ float: 'right' }}
      ></Icon>
    );
    this.iconInActive = (
      <Icon
        name="angle right"
        color="orange"
        size="large"
        style={{ float: 'right' }}
      ></Icon>
    );
  }

  handleClick = (e, titleProps) => {
    this.setState(prevState => ({
      active: !prevState.active,
    }));
  };

  hasError(errors) {
    return this.fieldPath in errors;
  }

  renderAccordion = props => {
    const {
      form: { errors },
    } = props;
    const { active } = this.state;

    return (
      <Segment>
        <Accordion fluid index={0}>
          <Form.Field required={this.required}>
            <Accordion.Title as="label" onClick={this.handleClick}>
              <label>{this.label}</label>
              <span>{active ? this.iconActive : this.iconInActive}</span>
            </Accordion.Title>
            <Accordion.Content active={active || this.hasError(errors)}>
              {this.props.children}
            </Accordion.Content>
          </Form.Field>
        </Accordion>
      </Segment>
    );
  };

  render() {
    return (
      <Field name={this.fieldPath} component={this.renderAccordion}></Field>
    );
  }
}

AccordionField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  uiProps: PropTypes.object,
};

AccordionField.defaultProps = {
  label: '',
  required: false,
  uiProps: {},
};
