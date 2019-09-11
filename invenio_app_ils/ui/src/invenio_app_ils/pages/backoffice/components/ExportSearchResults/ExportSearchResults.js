import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qs from 'qs';
import { Button, Popup, Dropdown, Menu } from 'semantic-ui-react';
import {
  InvenioRequestSerializer,
  withState as withSearchState,
} from 'react-searchkit';
import { invenioConfig } from '../../../../common/config/invenioConfig';

/** Simple component rendering a small dialog to choose format and page of results to export. */
class ExportDialog extends Component {
  constructor(props) {
    super(props);
    this.max = invenioConfig.max_results_window - 1;
    const totalHits = this.props.total;
    const lastPage = totalHits % this.max > 0 ? 1 : 0;
    const totalPages = Math.floor(totalHits / this.max) + lastPage;

    this.formatOptions = [
      {
        key: 'csv',
        text: 'CSV',
        value: 'csv',
      },
      {
        key: 'json',
        text: 'JSON',
        value: 'json',
      },
    ];

    this.resultsOptions = Array.from(Array(totalPages).keys()).map(i => {
      const page = i + 1;
      // build dropdown options, e.g.:
      // 1 - 9999, 10000 - 19999, ...
      const start = page === 1 ? 1 : i * this.max + 1;
      const end = page === totalPages ? totalHits : page * this.max;
      return {
        key: i,
        text: `${start} - ${end}`,
        value: page,
      };
    });

    this.state = {
      currentFormat: this.formatOptions[0].value,
      currentPage: this.resultsOptions[0].value,
    };
  }

  render() {
    return (
      <Popup
        trigger={<Button primary>Export</Button>}
        flowing
        on="click"
        position="top right"
      >
        <div>
          <span>
            Format{' '}
            <Menu compact>
              <Dropdown
                simple
                item
                options={this.formatOptions}
                defaultValue={this.formatOptions[0].value}
                onChange={(e, { value }) => {
                  this.setState({
                    currentFormat: value,
                  });
                }}
              />
            </Menu>
          </span>
        </div>
        <br />
        <div>
          <span>
            Results{' '}
            <Menu compact>
              <Dropdown
                simple
                item
                options={this.resultsOptions}
                defaultValue={this.resultsOptions[0].value}
                onChange={(e, { value }) => {
                  this.setState({
                    currentPage: value,
                  });
                }}
              />
            </Menu>
          </span>
        </div>
        <br />
        <div style={{ textAlign: 'center' }}>
          <Button
            icon="download"
            primary
            content="Download"
            onClick={() => {
              this.props.onExportClick(
                this.state.currentFormat,
                this.state.currentPage,
                this.max
              );
            }}
          />
        </div>
      </Popup>
    );
  }
}

ExportDialog.propTypes = {
  onExportClick: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

/** Wrapper component to export search results retrieved using ReactSearchKit */
class ExportSearchResultsWithState extends Component {
  constructor(props) {
    super(props);
    this.total = this.props.currentResultsState.data.total;
    this.exportBaseUrl = this.props.exportBaseUrl;
  }

  onExportClick = (format, page, size) => {
    const newQueryState = {
      ...this.props.currentQueryState,
      page: page,
      size: size,
    };

    const requestSerializer = new InvenioRequestSerializer();
    const queryString = requestSerializer.serialize(newQueryState);

    // append the `format` param
    const params = Qs.parse(queryString);
    params['format'] = format;
    const args = Qs.stringify(params);

    // build the final url
    const exportUrl = `${this.exportBaseUrl}?${args}`;
    // open in a new tab
    window.open(exportUrl, '_blank');
  };

  render() {
    const ExportDialogWithSearchState = withSearchState(ExportDialog);
    return (
      <ExportDialogWithSearchState
        onExportClick={this.onExportClick}
        total={this.total}
      />
    );
  }
}

ExportSearchResultsWithState.propTypes = {
  exportBaseUrl: PropTypes.string.isRequired,
  currentQueryState: PropTypes.object.isRequired,
  currentResultsState: PropTypes.object.isRequired,
};

/** Wrapper component to export search results retrieved using ReactSearchKit and injecting its state */
class ExportReactSearchKitResults extends Component {
  constructor(props) {
    super(props);
    this.exportBaseUrl = this.props.exportBaseUrl;
  }

  render() {
    const CmpWithState = withSearchState(ExportSearchResultsWithState);
    return <CmpWithState exportBaseUrl={this.exportBaseUrl} />;
  }
}

ExportReactSearchKitResults.propTypes = {
  exportBaseUrl: PropTypes.string.isRequired,
};

/** Wrapper component to export search results retrieved with custom backend APIs */
class ExportSearchResults extends Component {
  constructor(props) {
    super(props);
    this.onExportClick = this.props.onExportClick;
    this.withPagination = this.props.withPagination;
    this.total = this.props.total;
  }

  render() {
    return (
      <ExportDialog onExportClick={this.onExportClick} total={this.total} />
    );
  }
}

ExportSearchResults.propTypes = {
  onExportClick: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export { ExportReactSearchKitResults, ExportSearchResults };
