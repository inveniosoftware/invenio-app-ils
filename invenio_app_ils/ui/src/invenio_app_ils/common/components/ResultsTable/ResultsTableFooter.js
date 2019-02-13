import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class ResultsTableFooter extends Component {
  constructor(props) {
    super(props);
    this.showAllButton = this.props.showAllButton;
    this.colspan = this.props.columnsNumber;
  }

  _renderFooter = () => {
    const itemNumber = this.props.allRowsNumber;
    return itemNumber > this.props.showMaxRows ? (
      <Table.Footer fullWidth data-test="footer">
        <Table.Row>
          <Table.HeaderCell colSpan={this.colspan + 1} textAlign="right">
            <span>
              Showing first {this.props.showMaxRows} entries of{' '}
              {this.props.allRowsNumber}{' '}
            </span>
            <span>{this.showAllButton}</span>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    ) : null;
  };

  render() {
    return this._renderFooter();
  }
}

ResultsTableFooter.propTypes = {
  allRowsNumber: PropTypes.number.isRequired,
  columnsNumber: PropTypes.number.isRequired,
  showMaxRows: PropTypes.number.isRequired,
  showAllButton: PropTypes.node,
};
