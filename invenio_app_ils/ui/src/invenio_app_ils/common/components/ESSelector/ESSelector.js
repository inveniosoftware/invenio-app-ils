import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Container, Icon } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { HitsSearch } from './HitsSearch';
import './ESSelector.scss';

export default class ESSelector extends Component {
  constructor(props) {
    super(props);

    this.searchRef = null;
    this.props.updateSelections(props.initialSelections);
  }

  onSelectResult = result => {
    if (this.props.onSelectResult) {
      this.props.onSelectResult(result);
    }
    return this.props.multiple
      ? this.props.addMultiSelection(result)
      : this.props.addSingleSelection(result);
  };

  removeSelection = selection => {
    if (this.searchRef) {
      this.searchRef.searchInputRef.focus();
    }
    if (this.props.onRemoveSelection) {
      this.props.onRemoveSelection(selection);
    }
    this.props.removeSelection(selection);
  };

  renderSelection = selection => (
    <List.Item key={selection.id}>
      <List.Icon name="angle right" size="small" verticalAlign="middle" />
      <List.Content onClick={() => this.removeSelection(selection)}>
        <List.Header as="a">
          <span className="extra">{selection.extra}</span>
          {selection.title}
          <Icon name="delete" />
        </List.Header>
        <List.Description as="a">{selection.description}</List.Description>
      </List.Content>
    </List.Item>
  );

  renderSelections = (selections, renderSelection) => (
    <Container className="result-selections">
      <List divided relaxed>
        {selections.map(selection => renderSelection(selection))}
      </List>
    </Container>
  );

  renderSelectionInfoText = () => {
    const {
      selections,
      selectionInfoText,
      emptySelectionInfoText,
    } = this.props;
    if (!isEmpty(selections) && (selectionInfoText || emptySelectionInfoText)) {
      return (
        <p>
          {selections.length > 0 ? selectionInfoText : emptySelectionInfoText}
        </p>
      );
    }
  };

  render() {
    const { placeholder, selections } = this.props;
    const renderSelection = this.props.renderSelection
      ? this.props.renderSelection
      : this.renderSelection;
    const renderSelections = this.props.renderSelections
      ? this.props.renderSelections
      : this.renderSelections;
    return (
      <div id="es-selector">
        <HitsSearch
          query={this.props.query}
          delay={this.props.delay}
          alwaysWildcard={this.props.alwaysWildcard}
          minCharacters={this.props.minCharacters}
          placeholder={placeholder}
          onSelect={this.onSelectResult}
          ref={element => (this.searchRef = element)}
        />
        {this.renderSelectionInfoText()}
        {renderSelections(selections, renderSelection)}
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
  onSelectResult: PropTypes.func,
  onRemoveSelection: PropTypes.func,
  renderSelections: PropTypes.func,
  renderSelection: PropTypes.func,
};

ESSelector.defaultProps = {
  delay: 250,
  initialSelections: [],
  minCharacters: 3,
};
