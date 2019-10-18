import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Form, Tab, Label, Popup } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { ESSelector } from './';
import { recordToPidType } from '../../api/utils';

export default class ESRelatedSelector extends Component {
  constructor(props) {
    super(props);
    this.extraRefs = {};
    this.state = {
      recordType: Object.keys(props.config.recordTypes)[0],
      relationType: props.relation,
      showPopup: {},
      tabNames: Object.keys(props.config.recordTypes),
    };
  }

  get initialSelections() {
    return this.props.config.recordTypes[this.state.recordType].selections;
  }

  get selectorProps() {
    return this.props.config.recordTypes[this.state.recordType].selectorProps;
  }

  get serializeSelection() {
    const serialize = this.props.config.recordTypes[this.state.recordType]
      .serializeSelection;
    if (!serialize) {
      return result => result;
    }
    return serialize;
  }

  componentDidMount() {
    if (!isEmpty(this.extraRefs)) {
      this.extraRefs[Object.keys(this.extraRefs)[0]].inputRef.current.focus();
    }
  }

  onRecordTypeChange = (e, { value }) => {
    this.setState({ recordType: value });
  };

  onSelectResult = (result, initialSelection = false) => {
    const { id } = result;
    const { recordType, relationType } = this.state;
    const relatedId = `${id}-${recordType}-${relationType}`;

    result.metadata.new = !initialSelection;
    result.id = relatedId;
    result.key = relatedId;

    result.metadata.extraFields = result.metadata.extraFields || {};
    if (!isEmpty(this.extraRefs)) {
      for (const name in this.props.extraFields) {
        const input = this.extraRefs[name].inputRef.current;
        result.metadata.extraFields[name] = input.value;
        input.value = '';
      }
    }

    this.serializeSelection(result);
  };

  onTabChange = (e, { activeIndex }) => {
    this.setState({ recordType: this.state.tabNames[activeIndex] });
  };

  onSearchChange = query => {
    if (query) {
      for (const [name, input] of Object.entries(this.extraRefs)) {
        const value = input.inputRef.value;
        this.setState({ showPopup: { [name]: value === '' } });
      }
    }
  };

  onExtraFieldChange = (field, value) => {
    this.setState({ showPopup: { [field]: value === '' } });
  };

  renderSelectionsGroup = (selections, renderSelection, removeSelection) => (
    <List>
      {isEmpty(selections) ? (
        <List.Item>None</List.Item>
      ) : (
        selections.map(selection => renderSelection(selection, removeSelection))
      )}
    </List>
  );

  getTabPanes = (records, renderSelection, removeSelection) => {
    const config = this.props.config;
    return Object.keys(config['recordTypes']).map(type => ({
      menuItem: {
        key: type,
        icon: config.icon,
        content: (
          <>
            {type}
            <Label>{records[type] ? records[type].length : '0'}</Label>
          </>
        ),
      },
      render: () => (
        <Tab.Pane>
          {this.renderSelectionsGroup(
            records[type],
            renderSelection,
            removeSelection
          )}
        </Tab.Pane>
      ),
    }));
  };

  prepareSelections(selections) {
    const findRecordType = pidType => {
      const recordTypes = Object.entries(this.props.recordTypes);
      for (const [recordType, obj] of recordTypes) {
        if (obj.pidType === pidType) {
          return recordType;
        }
      }
      return null;
    };

    const records = {};
    for (const recordType in this.props.recordTypes) {
      records[recordType] = [];
    }

    for (const selection of selections) {
      const pidType = selection.metadata.pidType;
      const recordType = findRecordType(pidType);
      if (!recordType) {
        return [];
      }
      records[recordType].push(selection);
    }
    return records;
  }

  renderSelections = (selections, renderSelection, removeSelection) => {
    const records = this.prepareSelections(selections);
    const menu = {
      secondary: true,
      pointing: true,
    };
    return (
      <div className="result-selections">
        <Tab
          menu={menu}
          panes={this.getTabPanes(records, renderSelection, removeSelection)}
          activeIndex={this.state.tabNames.indexOf(this.state.recordType)}
          onTabChange={this.onTabChange}
        />
      </div>
    );
  };

  renderTypes() {
    const { recordTypes } = this.props.config;
    return Object.keys(recordTypes).length <= 1 ? null : (
      <Form.Group inline>
        <label>Related</label>
        {Object.keys(recordTypes).map(recordType => (
          <Form.Radio
            key={recordType}
            label={recordType}
            value={recordType}
            checked={this.state.recordType === recordType}
            onChange={this.onRecordTypeChange}
          />
        ))}
      </Form.Group>
    );
  }

  renderExtraFields() {
    const fields = [];
    const extraFields = this.props.extraFields;

    if (!extraFields) return null;

    for (const [name, field] of Object.entries(extraFields)) {
      const FieldComponent = field.component;
      fields.push(
        <Form.Group inline key={name}>
          <label>{field.label}</label>
          <FieldComponent
            ref={el => (this.extraRefs[name] = el)}
            onChange={(_, { value }) => this.onExtraFieldChange(name, value)}
            {...field.props}
          />
          <Popup
            context={
              this.extraRefs[name] ? this.extraRefs[name].inputRef : null
            }
            content={`Please specify a ${field.label.toLowerCase()}.`}
            position="right center"
            open={this.state.showPopup[name]}
          />
        </Form.Group>
      );
    }
    return fields;
  }

  renderRelatedRecordTypes() {
    return (
      <>
        {this.renderTypes()}
        {this.renderExtraFields()}
      </>
    );
  }

  serializer(customSerializer) {
    const custom = customSerializer ? customSerializer : hit => hit;
    return hit => {
      const pidType = recordToPidType(hit);
      hit.metadata.pidType = pidType;
      hit.metadata.recordType = this.state.recordType;
      hit.metadata.relationType = this.state.relationType;
      return custom(hit);
    };
  }

  render() {
    const props = Object.assign({}, this.props, this.selectorProps);
    props.serializer = this.serializer(props.serializer);
    return (
      <Form className="related-records-form">
        {this.renderRelatedRecordTypes()}
        <Form.Group className="related-search-form-group">
          <Form.Field className="related-search-field">
            <label>Search</label>
            <ESSelector
              onSelectResult={this.onSelectResult}
              initialSelections={this.initialSelections}
              renderSelections={this.renderSelections}
              onRemoveSelection={this.onRemoveSelection}
              onSearchChange={this.onSearchChange}
              placeholder="Search for a related record..."
              {...props}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

ESRelatedSelector.propTypes = {
  alwaysWildcard: PropTypes.bool,
  delay: PropTypes.number,
  initialSelections: PropTypes.array,
  minCharacters: PropTypes.number,
  multiple: PropTypes.bool,
  query: PropTypes.func,
  onSelectResult: PropTypes.func,
  onRemoveSelection: PropTypes.func,
  renderSelections: PropTypes.func,
  renderSelection: PropTypes.func,
  extraFields: PropTypes.object,
};
