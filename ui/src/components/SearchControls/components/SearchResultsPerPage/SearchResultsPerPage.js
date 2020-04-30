import React, { Component } from 'react';
import { ResultsPerPage } from 'react-searchkit';
import { getSearchConfig } from '../../../../config';
import PropTypes from 'prop-types';

export default class SearchResultsPerPage extends Component {
  searchConfig = getSearchConfig(this.props.modelName);
  render() {
    return (
      <>
        <ResultsPerPage
          values={this.searchConfig.RESULTS_PER_PAGE}
          defaultValue={this.searchConfig.RESULTS_PER_PAGE[0].value}
          label={cmp => <> Show {cmp} results per page</>}
        />
      </>
    );
  }
}

SearchResultsPerPage.propTypes = {
  modelName: PropTypes.string.isRequired,
};
