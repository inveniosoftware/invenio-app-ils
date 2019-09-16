import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Modal, Segment } from 'semantic-ui-react';
import { ESSelector } from './';
import './ESSelector.scss';
import { DateTime } from 'luxon';
import { invenioConfig } from '../../config';
import { toShortDate, toUTCShortDate } from '../../api/date';
import { DateRangePicker } from '../DateRangePicker';
import { isEmpty } from 'lodash';

export const PatronSearchInputContext = React.createContext({
  patronSelectionError: 'false',
});

export default class ESSelectorLoanRequest extends Component {
  state = { visible: false };

  constructor(props) {
    super(props);
    this.selectorRef = null;
    this.state = { missingPatron: 'false' };
    const tomorrow = DateTime.local().plus({ days: 1 });
    const loanDuration = new DateTime(
      tomorrow.plus({ days: invenioConfig.circulation.defaultDuration })
    );
    this.state = {
      fromDate: props.defaultStartDate
        ? props.defaultStartDate
        : toShortDate(tomorrow),
      toDate: props.defaultEndDate
        ? props.defaultEndDate
        : toShortDate(loanDuration),
      deliveryMethod: this.deliveryMethods()[1].value,
    };
  }

  toggle = () => this.setState({ visible: !this.state.visible });

  save = () => {
    const { onSave } = this.props;
    if (isEmpty(this.props.selections)) {
      this.setState({ missingPatron: 'true' });
    } else {
      if (onSave) {
        onSave(
          this.props.selections,
          toUTCShortDate(this.state.fromDate),
          toUTCShortDate(this.state.toDate),
          this.state.deliveryMethod
        );
      }
      this.toggle();
    }
  };

  handleDateChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleDeliveryMethodChange = (event, object) => {
    this.setState({ deliveryMethod: object.value });
  };

  deliveryMethods = () => {
    return invenioConfig.circulation.deliveryMethods.map(method => {
      return { key: method, value: method, text: method };
    });
  };

  render() {
    const { title, content, selectorComponent, size } = this.props;
    const trigger = React.cloneElement(this.props.trigger, {
      onClick: this.toggle,
    });
    const Selector = selectorComponent ? selectorComponent : ESSelector;

    return (
      <Modal
        id="es-selector-modal"
        open={this.state.visible}
        trigger={trigger}
        size={size}
        centered={false}
        onClose={this.toggle}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <p>{content}</p>
          <PatronSearchInputContext.Provider
            value={{ patronSelectionError: this.state.missingPatron }}
          >
            <Selector {...this.props} />
          </PatronSearchInputContext.Provider>
        </Modal.Content>
        <Form>
          <Segment.Group>
            <Segment>
              <Header
                as="h3"
                content="Request loan"
                subheader="Choose the period of interest for the book"
              />
            </Segment>
            <Segment>
              <Segment.Group horizontal>
                <DateRangePicker
                  defaultStart={this.state.fromDate}
                  defaultEnd={this.state.toDate}
                  handleDateChange={this.handleDateChange}
                />
              </Segment.Group>
              <Form.Field>
                <label>Choose the book delivery method</label>
                <Form.Dropdown
                  placeholder={'Select delivery method'}
                  options={this.deliveryMethods()}
                  onChange={this.handleDeliveryMethodChange}
                  defaultValue={this.deliveryMethods()[1].value}
                  selection
                />
              </Form.Field>
              <Modal.Actions>
                <Button color="black" onClick={this.toggle}>
                  Close
                </Button>
                <Button onClick={this.save}>Request</Button>
              </Modal.Actions>
            </Segment>
          </Segment.Group>
        </Form>
      </Modal>
    );
  }
}

ESSelectorLoanRequest.propTypes = {
  alwaysWildcard: PropTypes.bool,
  multiple: PropTypes.bool,
  trigger: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.string,
  initialSelections: PropTypes.array,
  onSelectResult: PropTypes.func,
  onRemoveSelection: PropTypes.func,
  onSave: PropTypes.func,
  renderSelections: PropTypes.func,
  renderSelection: PropTypes.func,
};

ESSelectorLoanRequest.defaultProps = {
  size: 'tiny',
};
