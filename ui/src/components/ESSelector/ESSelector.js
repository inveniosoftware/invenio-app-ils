import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Container, Icon } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { HitsSearch } from './HitsSearch';
import find from 'lodash/find';

export default class ESSelector extends Component {
  constructor(props) {
    super(props);

    const selections = [];
    for (const selection of props.initialSelections) {
      if (props.onSelectResult) {
        props.onSelectResult(selection, true);
      }
      selections.push(selection);
    }

    this.searchRef = null;
    this.state = {
      selections: selections,
    };
  }

  updateSelections = selections => {
    this.setState({ selections });
    this.props.onSelectionsUpdate(selections);
  };

  addSingleSelection = selection => {
    const selections = [selection];
    this.updateSelections(selections);
  };

  addMultiSelection = selection => {
    const currentSelections = [...this.state.selections];
    let hasMatch = find(currentSelections, sel => sel.id === selection.id);

    if (!hasMatch) {
      currentSelections.push(selection);
      this.updateSelections(currentSelections);
    }
  };

  onSelectResult = result => {
    if (this.props.onSelectResult) {
      this.props.onSelectResult(result);
    }
    return this.props.multiple
      ? this.addMultiSelection(result)
      : this.addSingleSelection(result);
  };

  removeSelection = selection => {
    // Remove from state
    const selections = this.state.selections.filter(
      currentSelection => currentSelection.id !== selection.id
    );
    this.updateSelections(selections);

    if (this.searchRef) {
      this.searchRef.searchInputRef.focus();
    }
    if (this.props.onRemoveSelection) {
      this.props.onRemoveSelection(selection);
    }
  };

  renderSelection = (selection, removeSelection) => (
    <List.Item key={selection.id}>
      <List.Icon name="angle right" size="small" verticalAlign="middle" />
      <List.Content onClick={() => removeSelection(selection)}>
        <List.Header as="a">
          <span className="extra">{selection.extra}</span>
          {selection.title}
          <Icon name="delete" />
        </List.Header>
        <List.Description as="a">{selection.description}</List.Description>
      </List.Content>
    </List.Item>
  );

  renderSelections = (selections, renderSelection, removeSelection) => (
    <Container className="result-selections">
      <List divided relaxed>
        {selections.map(selection =>
          renderSelection(selection, removeSelection)
        )}
      </List>
    </Container>
  );

  renderSelectionInfoText = () => {
    const { selectionInfoText, emptySelectionInfoText } = this.props;
    const selections = this.state.selections;
    if (!isEmpty(selections) && (selectionInfoText || emptySelectionInfoText)) {
      return (
        <p>
          {selections.length > 0 ? selectionInfoText : emptySelectionInfoText}
        </p>
      );
    }
  };

  render() {
    const { placeholder } = this.props;
    const selections = this.state.selections;
    const renderSelection = this.props.renderSelection
      ? this.props.renderSelection
      : this.renderSelection;
    const renderSelections = this.props.renderSelections
      ? this.props.renderSelections
      : this.renderSelections;
    return (
      <div id="es-selector">
        <HitsSearch
          disabled={this.props.disabled}
          id={this.props.id}
          name={this.props.name}
          query={this.props.query}
          delay={this.props.delay}
          alwaysWildcard={this.props.alwaysWildcard}
          minCharacters={this.props.minCharacters}
          placeholder={placeholder}
          serializer={this.props.serializer}
          onSelect={this.onSelectResult}
          onSearchChange={this.props.onSearchChange}
          ref={element => (this.searchRef = element)}
        />
        {this.renderSelectionInfoText()}
        {renderSelections(selections, renderSelection, this.removeSelection)}
      </div>
    );
  }
}

ESSelector.propTypes = {
  alwaysWildcard: PropTypes.bool,
  delay: PropTypes.number,
  initialSelections: PropTypes.array,
  minCharacters: PropTypes.number,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  query: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func,
  onSelectResult: PropTypes.func,
  onSelectionsUpdate: PropTypes.func,
  onRemoveSelection: PropTypes.func,
  renderSelections: PropTypes.func,
  renderSelection: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

ESSelector.defaultProps = {
  delay: 250,
  initialSelections: [],
  minCharacters: 3,
  onSelectionsUpdate: () => {},
};
