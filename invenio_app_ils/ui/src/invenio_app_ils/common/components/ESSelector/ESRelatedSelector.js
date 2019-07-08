import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Form, Dropdown, Tab, Label } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { ESSelector } from './';
import { document as documentApi, series as seriesApi } from '../../api/';
import './ESRelatedSelector.scss';
import {
  LanguageRelation,
  getRelationTypes,
  getRelationTypeByName,
  getIconByRelation,
  getRelationTypeById,
} from '../RelatedRecords/config';

export default class ESRelatedSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pidType: 'docid',
      relationType: LanguageRelation.name,
    };
  }

  get query() {
    switch (this.state.pidType) {
      case 'docid':
        return documentApi.list;
      case 'serid':
        return seriesApi.list;
      default:
        throw Error(`Invalid pid type: ${this.state.pidType}`);
    }
  }

  get relationOptions() {
    const options = [];
    for (const relation of getRelationTypes()) {
      options.push({
        key: relation.name,
        value: relation.name,
        text: relation.label,
        disabled: false,
      });
    }
    return options;
  }

  onPidTypeChange = (e, { value }) => {
    this.setState({ pidType: value });
  };

  onRelationTypeChange = (e, { value }) => {
    this.setState({ relationType: value });
  };

  onSelectResult = result => {
    const { id } = result;
    const { pidType, relationType } = this.state;
    const relatedId = `${id}-${pidType}-${relationType}`;

    result.metadata.pid = id;
    result.metadata.pidType = pidType;
    result.metadata.relationType = relationType;
    result.metadata.new = true;
    result.id = relatedId;
    result.key = relatedId;
  };

  onTabChange = (e, { activeIndex }) => {
    const relation = getRelationTypeById(activeIndex);
    this.setState({ relationType: relation.name });
  };

  renderSelectionsGroup = (selections, renderSelection) => (
    <List>
      {isEmpty(selections) ? (
        <List.Item>None</List.Item>
      ) : (
        selections.map(selection => renderSelection(selection))
      )}
    </List>
  );

  getTabPanes = (records, renderSelection) => {
    return getRelationTypes().map(relation => ({
      menuItem: {
        key: relation.name,
        icon: getIconByRelation(relation),
        content: (
          <>
            {relation.label} <Label>{records[relation.name].length}</Label>
          </>
        ),
      },
      render: () => (
        <Tab.Pane>
          {this.renderSelectionsGroup(records[relation.name], renderSelection)}
        </Tab.Pane>
      ),
    }));
  };

  prepareSelections(selections) {
    const records = {};
    for (const relation of getRelationTypes()) {
      records[relation.name] = [];
    }
    for (const selection of selections) {
      records[selection.metadata.relationType].push(selection);
    }
    return records;
  }

  renderSelections = (selections, renderSelection) => {
    const activeTab = getRelationTypeByName(this.state.relationType).id;
    const records = this.prepareSelections(selections);
    const menu = {
      secondary: true,
      pointing: true,
    };
    return (
      <Tab
        menu={menu}
        panes={this.getTabPanes(records, renderSelection)}
        activeIndex={activeTab}
        onTabChange={this.onTabChange}
      />
    );
  };

  render() {
    const { pidType, relationType } = this.state;
    const relationOptions = this.relationOptions;
    return (
      <Form className="related-records-form">
        <Form.Group inline>
          <label>Related</label>
          <Form.Radio
            label="Document"
            value="docid"
            checked={pidType === 'docid'}
            onChange={this.onPidTypeChange}
          />
          <Form.Radio
            label="Series"
            value="serid"
            checked={pidType === 'serid'}
            onChange={this.onPidTypeChange}
          />
        </Form.Group>
        <Form.Group inline>
          <label>Type</label>
          <Dropdown
            placeholder="Select relation type"
            fluid
            selection
            options={relationOptions}
            onChange={this.onRelationTypeChange}
            value={relationType}
          />
        </Form.Group>
        <Form.Group className="related-search-form-group">
          <Form.Field className="related-search-field">
            <label>Search</label>
            <ESSelector
              query={this.query}
              onSelectResult={this.onSelectResult}
              renderSelections={(selections, render) =>
                this.renderSelections(selections, render)
              }
              onRemoveSelection={this.onRemoveSelection}
              placeholder="Search for a related record..."
              {...this.props}
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
};
