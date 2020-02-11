import { HitsSearch } from '@components/ESSelector/HitsSearch';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export default class RelationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpen: false,
    };
  }

  disabledSelectionOption = result => {
    /* if relation already exists the option gets blocked */
    const { relations, refererRecordPid } = this.props;
    const hasRelations = !isEmpty(relations);
    if (!hasRelations) {
      return false;
    }

    const relationExists = relations.find(o => o.pid === result.metadata.pid);
    const isReferer = refererRecordPid === result.metadata.pid;

    return relationExists || isReferer;
  };

  isSelected = option => {
    return this.props.selections.find(o => o.pid === option.metadata.pid);
  };

  selectResultRender = option => {
    let disabled = false;

    if (this.disabledSelectionOption(option) || this.isSelected(option)) {
      disabled = true;
    }

    return this.props.resultRenderer(option, disabled);
  };

  onSelectResult = result => {
    if (this.props.mode === 'single') {
      this.props.resetSelections();
    }
    if (!this.disabledSelectionOption(result) || this.isSelected(result)) {
      this.props.selectOption(result);
    }
  };

  render() {
    const { optionsQuery, currentRecordType } = this.props;
    return (
      <HitsSearch
        key={currentRecordType}
        query={optionsQuery}
        delay={250}
        minCharacters={3}
        placeholder={'Type to find a literature...'}
        onSelect={this.onSelectResult}
        value={''}
        resultRenderer={this.selectResultRender}
        ref={element => (this.searchRef = element)}
      />
    );
  }
}
RelationSelector.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.array.isRequired,
  optionsQuery: PropTypes.func.isRequired,
  relationType: PropTypes.string.isRequired,
  resultRenderer: PropTypes.func.isRequired,
  refererRecordPid: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['single', 'multi']),
};
