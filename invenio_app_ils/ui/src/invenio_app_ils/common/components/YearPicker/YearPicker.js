import React, { Component } from 'react';
import { YearInput } from 'semantic-ui-calendar-react';
import PropTypes from 'prop-types';

export class YearPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: props.defaultValue,
    };
  }

  handleYearChange = (_, { name, value }) => {
    this.setState({ selectedYear: value });
    this.props.handleYearChange(value, name);
  };

  render() {
    return (
      <YearInput
        autoComplete="off"
        clearable
        closable
        iconPosition="left"
        initialDate={this.props.initialYear}
        error={this.props.error}
        label={this.props.label}
        id={this.props.id}
        name={this.props.name}
        onChange={this.handleYearChange}
        placeholder={this.props.placeholder}
        value={this.state.selectedYear}
        data-test={this.state.selectedYear}
      />
    );
  }
}

YearPicker.propTypes = {
  defaultValue: PropTypes.string,
  error: PropTypes.object,
  handleBlur: PropTypes.func,
  handleYearChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  initialYear: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};

YearPicker.defaultProps = {
  initialYear: '',
  defaultValue: '',
  placeholder: '',
  name: 'selectedYear',
};
