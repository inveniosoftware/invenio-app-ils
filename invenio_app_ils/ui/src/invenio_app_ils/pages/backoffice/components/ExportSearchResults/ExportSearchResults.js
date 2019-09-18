import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qs from 'qs';
import { Button, Popup, Dropdown, Menu } from 'semantic-ui-react';
import {
  InvenioRequestSerializer,
  withState as withSearchState,
} from 'react-searchkit';
import { invenioConfig } from '../../../../common/config/invenioConfig';

/** Simple component rendering a small dialog to choose format of results to export. */
class ExportDialog extends Component {
  constructor(props) {
    super(props);
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

    this.state = {
      currentFormat: this.formatOptions[0].value,
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
          <span>Only the first {this.props.max} results will be exported.</span>
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
                this.props.max
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
  max: PropTypes.number.isRequired,
};

ExportDialog.defaultProps = {
  max: invenioConfig.max_results_window,
};

/** Wrapper component to export search results retrieved using ReactSearchKit */
class ExportSearchResultsWithState extends Component {
  constructor(props) {
    super(props);
    this.total = this.props.currentResultsState.data.total;
    this.exportBaseUrl = this.props.exportBaseUrl;
  }

  onExportClick = (format, size) => {
    const newQueryState = {
      ...this.props.currentQueryState,
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
    return <ExportDialogWithSearchState onExportClick={this.onExportClick} />;
  }
}

ExportSearchResultsWithState.propTypes = {
  exportBaseUrl: PropTypes.string.isRequired,
  currentQueryState: PropTypes.object.isRequired,
  currentResultsState: PropTypes.object.isRequired,
};

/** Wrapper component to export search results retrieved using ReactSearchKit and injecting its state */
class ExportReactSearchKitResults extends Component {
  render() {
    const CmpWithState = withSearchState(ExportSearchResultsWithState);
    return <CmpWithState exportBaseUrl={this.props.exportBaseUrl} />;
  }
}

ExportReactSearchKitResults.propTypes = {
  exportBaseUrl: PropTypes.string.isRequired,
};

/** Wrapper component to export search results retrieved with custom backend APIs */
class ExportSearchResults extends Component {
  render() {
    return <ExportDialog onExportClick={this.props.onExportClick} />;
  }
}

ExportSearchResults.propTypes = {
  onExportClick: PropTypes.func.isRequired,
};

export { ExportReactSearchKitResults, ExportSearchResults };
