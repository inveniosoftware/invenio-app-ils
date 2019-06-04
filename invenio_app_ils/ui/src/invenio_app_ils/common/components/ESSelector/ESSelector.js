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

  removeSelection = selection => {
    if (this.searchRef) {
      this.searchRef.searchInputRef.focus();
    }
    this.props.removeSelection(selection);
  };

  renderSelections = () => (
    <Container className="result-selections">
      <List divided relaxed>
        {this.props.selections.map(selection => (
          <List.Item key={selection.id}>
            <List.Icon name="angle right" size="small" verticalAlign="middle" />
            <List.Content onClick={() => this.removeSelection(selection)}>
              <List.Header as="a">
                <span className="extra">{selection.extra}</span>
                {selection.title}
                <Icon name="delete" />
              </List.Header>
              <List.Description as="a">
                {selection.description}
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Container>
  );

  render() {
    return (
      <div id="es-selector">
        <HitsSearch
          query={this.props.query}
          delay={this.props.delay}
          alwaysWildcard={this.props.alwaysWildcard}
          minCharacters={this.props.minCharacters}
          onSelect={result =>
            this.props.multiple
              ? this.props.addMultiSelection(result)
              : this.props.addSingleSelection(result)
          }
          ref={element => (this.searchRef = element)}
        />
        {!isEmpty(this.props.selections) && this.renderSelections()}
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
  query: PropTypes.func.isRequired,
};

ESSelector.defaultProps = {
  delay: 250,
  minCharacters: 3,
};
