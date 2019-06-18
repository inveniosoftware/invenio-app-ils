import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Grid, Container, Form, Dropdown } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import truncate from 'lodash/truncate';
import { ESSelector } from './';
import { document as documentApi, series as seriesApi } from '../../api/';
import './ESRelatedSelector.scss';

export const RelationTypes = Object.freeze({
  EDITION: { id: 0, text: 'Edition' },
  LANGUAGE: { id: 1, text: 'Translation' },
});

export default class ESRelatedSelector extends Component {
  state = {
    pidType: 'docid',
    relationType: RelationTypes.EDITION.id,
  };

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
    const edition = RelationTypes.EDITION;
    const language = RelationTypes.LANGUAGE;
    return [
      {
        key: edition.id,
        value: edition.id,
        text: edition.text,
        disabled: false,
      },
      {
        key: language.id,
        value: language.id,
        text: language.text,
        disabled: this.state.pidType === 'serid',
      },
    ];
  }

  onPidTypeChange = (e, { value }) => {
    const stateChanges = { pidType: value };
    if (value === 'serid') {
      stateChanges.relationType = RelationTypes.EDITION.id;
    }
    this.setState(stateChanges);
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

  renderSelectionsGroup = (selections, renderSelection) => (
    <List.List>
      {isEmpty(selections) ? (
        <List.Item>None</List.Item>
      ) : (
        selections.map(selection => {
          selection.title = truncate(selection.title, { length: 30 });
          return renderSelection(selection);
        })
      )}
    </List.List>
  );

  renderSelections = (selections, renderSelection) => {
    const editions = this.renderSelectionsGroup(
      selections.filter(
        x => x.metadata.relationType === RelationTypes.EDITION.id
      ),
      renderSelection
    );
    const translations = this.renderSelectionsGroup(
      selections.filter(
        x => x.metadata.relationType === RelationTypes.LANGUAGE.id
      ),
      renderSelection
    );
    return (
      <Container className="result-selections">
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <List>
                <List.Item>
                  <List.Icon name="book" />
                  <List.Content>
                    <List.Header>Editions</List.Header>
                    {editions}
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={8}>
              <List>
                <List.Item>
                  <List.Icon name="book" />
                  <List.Content>
                    <List.Header>Translations</List.Header>
                    {translations}
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  };

  render() {
    const { pidType, relationType } = this.state;
    const relationOptions = this.relationOptions;
    const relationTypeValue = relationOptions[relationType].value;
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
            value={relationTypeValue}
          />
        </Form.Group>
        <Form.Group className="related-search-form-group">
          <Form.Field className="related-search-field">
            <label>Search</label>
            <ESSelector
              query={this.query}
              onSelectResult={this.onSelectResult}
              renderSelections={this.renderSelections}
              onRemoveSelection={this.onRemoveSelection}
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
