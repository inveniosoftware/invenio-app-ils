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
    const { existingRelations, referrerRecordPid } = this.props;

    /* if itself, disable it */
    const isReferrer = referrerRecordPid === result.metadata.pid;
    if (isReferrer) {
      return true;
    }

    /* if relation already exists the option gets blocked */
    const hasRelations = !isEmpty(existingRelations);
    if (!hasRelations) {
      return false;
    }

    const relationExists = existingRelations.find(
      rel => rel.pid_value === result.metadata.pid
    );
    return relationExists;
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
  /* selections got from the current document, reducer */
  selections: PropTypes.array.isRequired,
  existingRelations: PropTypes.array,
  optionsQuery: PropTypes.func.isRequired,
  resultRenderer: PropTypes.func.isRequired,
  referrerRecordPid: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['single', 'multi']),
  currentRecordType: PropTypes.string,
};

RelationSelector.defaultProps = {
  existingRelations: [],
};
