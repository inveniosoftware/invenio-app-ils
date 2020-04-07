import { SearchEmptyResults } from '@components/SearchControls';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { LoanListEntry } from './LoanListEntry';

export default class LoanList extends Component {
  renderListEntry = loan => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(loan);
    }
    return <LoanListEntry key={loan.metadata.pid} loan={loan} />;
  };

  render() {
    const { hits } = this.props;
    return _isEmpty(hits) ? (
      <SearchEmptyResults />
    ) : (
      <Item.Group divided className={'bo-loan-search'}>
        {hits.map(hit => this.renderListEntry(hit))}
      </Item.Group>
    );
  }
}

LoanList.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object),
};

LoanList.defaultProps = {
  hits: [],
};
