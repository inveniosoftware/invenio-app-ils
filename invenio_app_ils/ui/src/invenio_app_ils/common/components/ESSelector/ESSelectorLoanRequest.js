import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Modal, Segment } from 'semantic-ui-react';
import { ESSelector } from './';
import './ESSelector.scss';
import { DateTime } from 'luxon';
import { invenioConfig } from '../../config';
import { DatePicker } from '../../components';
import { toShortDate } from '../../api/date';
import { isEmpty } from 'lodash';

export const PatronSearchInputContext = React.createContext({
  patronSelectionError: 'false',
});

export default class ESSelectorLoanRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      missingPatron: 'false',
      requestEndDate: '',
      deliveryMethod: '',
    };
    this.selectorRef = null;

    // init delivery method
    this.withDeliveryMethod = !isEmpty(
      invenioConfig.circulation.deliveryMethods
    );
    this.deliveryMethods = this.withDeliveryMethod
      ? Object.keys(invenioConfig.circulation.deliveryMethods).map(key => ({
          key: key,
          value: key,
          text: invenioConfig.circulation.deliveryMethods[key],
        }))
      : [];
    this.state['deliveryMethod'] = this.withDeliveryMethod
      ? this.deliveryMethods[1].value
      : null;
  }

  toggle = () => this.setState({ visible: !this.state.visible });

  save = () => {
    const { onSave } = this.props;
    if (isEmpty(this.props.selections)) {
      this.setState({ missingPatron: 'true' });
    } else {
      if (onSave) {
        const patronPid = this.props.selections[0].metadata.id.toString();
        const optionalParams = {};
        if (!isEmpty(this.state.requestEndDate)) {
          optionalParams.requestEndDate = this.state.requestEndDate;
        }
        if (!isEmpty(this.state.deliveryMethod)) {
          optionalParams.deliveryMethod = this.state.deliveryMethod;
        }
        onSave(patronPid, optionalParams);
      }
      this.toggle();
    }
  };

  handleRequestEndDateChange = value => {
    this.setState({ requestEndDate: value });
  };

  handleDeliveryMethodChange = (_, { value }) => {
    this.setState({ deliveryMethod: value });
  };

  renderOptionalRequestExpirationDate = () => {
    const today = DateTime.local();
    const initialDate = new DateTime(today.plus({ days: 10 }));
    const max = new DateTime(
      today.plus({ days: invenioConfig.circulation.requestDuration })
    );
    return (
      <div>
        <Segment.Inline>
          <div>Optionally, select a limit date for your request</div>
          <DatePicker
            initialDate={toShortDate(initialDate)}
            minDate={toShortDate(today)}
            maxDate={toShortDate(max)}
            placeholder="Request limit date"
            handleDateChange={this.handleRequestEndDateChange}
          />
        </Segment.Inline>
      </div>
    );
  };

  renderDeliveryMethodSelector = () => {
    return this.withDeliveryMethod ? (
      <Form.Field>
        <label>Choose the book delivery method</label>
        <Form.Dropdown
          placeholder={'Select delivery method'}
          options={this.deliveryMethods}
          onChange={this.handleDeliveryMethodChange}
          defaultValue={this.deliveryMethods[1].value}
          selection
        />
      </Form.Field>
    ) : null;
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
              <Header as="h3" content="Request loan" />
            </Segment>
            <Segment>
              {this.renderDeliveryMethodSelector()}
              {this.renderOptionalRequestExpirationDate()}
            </Segment>
            <Segment>
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
