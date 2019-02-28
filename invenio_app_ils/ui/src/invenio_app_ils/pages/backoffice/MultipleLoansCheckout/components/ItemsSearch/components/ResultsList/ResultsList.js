import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../../common/components';
import { Button } from 'semantic-ui-react';
import { ResultsTableFormatter as formatter } from '../../../../../../../common/components';
import { invenioConfig } from '../../../../../../../common/config';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
    this.addItemToBasket = this.props.addItemToBasket;
    this.clearResults = this.props.clearResults;
  }

  actions(item, itemState) {
    const circulationStatus = item.hasOwnProperty('state') ? item.status : null;

    if (
      invenioConfig.circulation.loanActiveStates.includes(circulationStatus) ||
      invenioConfig.items.available.status.includes(itemState)
    ) {
      return <Button disabled content={'Add item'} />;
    }
    return (
      <Button
        content={'Add item'}
        onClick={() => {
          this.addItemToBasket(item);
          this.clearResults();
        }}
      />
    );
  }

  prepareData() {
    return this.props.results.map(row => {
      let serialised = formatter.item.toTable(row);
      serialised['Actions'] = this.actions(row, row.state);
      delete serialised['Created'];
      delete serialised['Updated'];
      return serialised;
    });
  }

  render() {
    const rows = this.prepareData();
    return rows.length ? (
      <ResultsTable
        rows={rows}
        name={''}
        actionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
  addItemToBasket: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
};
