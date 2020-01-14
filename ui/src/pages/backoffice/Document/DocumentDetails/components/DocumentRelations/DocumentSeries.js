import { document as documentApi, series as seriesApi } from '@api';
import { Error, Loader, Pagination, ResultsTable } from '@components';
import { ESSelectorModal } from '@components/ESSelector';
import ESRelatedSelector from '@components/ESSelector/ESRelatedSelector';
import {
  serializeDocument,
  serializeSeries,
} from '@components/ESSelector/serializer';
import { SeriesViewDetailsLink } from '@pages/backoffice';
import { ManageRelationsButton } from '@pages/backoffice/components/ManageRelationsButton';
import DocumentRelations, {
  serializeEdition,
  serializeEditionSelection,
  serializeLanguage,
  serializeLanguageSelection,
  serializeSelection,
} from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/DocumentRelations';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Input, Label, Tab } from 'semantic-ui-react';

export const serializeSeriesSelection = selection => {
  if (!selection.metadata.extraFields.volume) {
    selection.metadata.extraFields.volume = selection.metadata.volume;
  }
  selection.description = `Volume: ${selection.metadata.extraFields.volume ||
    '-'}`;
  return selection;
};

export default class DocumentSeries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      activePage: {},
      removedRelations: [],
    };
  }

  get activePage() {
    const { activeIndex, activePage } = this.state;
    if (!activePage[activeIndex]) {
      return 1;
    }
    return activePage[activeIndex];
  }

  onTabChange = activeIndex => {
    this.setState({ activeIndex });
  };

  onPageChange = page => {
    const { activeIndex, activePage } = this.state;
    activePage[activeIndex] = page;
    this.setState({ activePage: activePage });
  };

  getPaginator(rows, activePage) {
    return (
      <Pagination
        currentPage={activePage}
        currentSize={this.props.showMaxRows}
        loading={this.props.isLoading}
        totalResults={rows.length}
        onPageChange={this.onPageChange}
      />
    );
  }

  getEditButton = key => {
    const buttons = {
      multipart: (
        <ManageRelationsButton
          SelectorModal={ESSelectorModal}
          Selector={ESRelatedSelector}
          enabled={true}
          config={{
            modal: {
              title: 'Manage related multipart monographs',
              content: 'Select related multipart monographs.',
              extraFields: {
                volume: {
                  component: Input,
                  label: 'Volume',
                  props: {
                    placeholder: 'Enter volume number...',
                  },
                },
              },
            },
            recordTypes: {
              'Multipart monograph': {
                pidType: 'serid',
                serializeSelection: serializeSeriesSelection,
                selectorProps: {
                  query: seriesApi.multipartMonographs,
                  serializer: serializeSeries,
                },
              },
            },
          }}
          initialSelections={this.getSelections('multipart_monograph')}
          relation="multipart_monograph"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
      ),
      serials: (
        <ManageRelationsButton
          SelectorModal={ESSelectorModal}
          Selector={ESRelatedSelector}
          enabled={true}
          config={{
            modal: {
              title: 'Manage related serials',
              content: 'Select related serials.',
              extraFields: {
                volume: {
                  component: Input,
                  label: 'Volume',
                  props: {
                    placeholder: 'Enter volume number...',
                  },
                },
              },
            },
            recordTypes: {
              Serial: {
                pidType: 'serid',
                serializeSelection: serializeSeriesSelection,
                selectorProps: {
                  query: seriesApi.serials,
                  serializer: serializeSeries,
                },
              },
            },
          }}
          initialSelections={this.getSelections('serial')}
          relation="serial"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
      ),
    };

    return buttons[key];
  };

  viewDetails = ({ row }) => {
    if (row.pid_type === 'serid') {
      return (
        <SeriesViewDetailsLink
          seriesPid={row.pid}
          as={Link}
          data-test={row.pid}
        />
      );
    } else {
      console.warn(`Unknown pid type: ${row.pid_type}`);
    }
  };

  renderTab = (rows, columns, name, editButton) => {
    const activePage = this.activePage;
    const size = this.props.showMaxRows;
    const activeRows = rows.slice((activePage - 1) * size, activePage * size);
    return (
      <Tab.Pane>
        {editButton}
        <ResultsTable
          data={activeRows}
          columns={columns}
          totalHitsCount={rows.length}
          name={name}
          showMaxRows={size}
          paginationComponent={this.getPaginator(rows, activePage)}
          currentPage={activePage}
        />
      </Tab.Pane>
    );
  };

  getTabPanes() {
    const serials = this.props.relations['serial'] || [];
    const multipartMonographs =
      this.props.relations['multipart_monograph'] || [];

    return [
      {
        menuItem: {
          key: 'multipart_monograph',
          content: (
            <>
              <Label>{multipartMonographs.length}</Label> Multipart monographs
            </>
          ),
        },
        render: () =>
          this.renderTab(
            multipartMonographs,
            [
              { title: '', field: '', formatter: this.viewDetails },
              { title: 'ID', field: 'pid' },
              { title: 'Title', field: 'title' },
              { title: 'Type', field: 'pid_type' },
              { title: 'Volume', field: 'volume' },
            ],
            'related multipart monographs',
            this.getEditButton('multipart')
          ),
      },
      {
        menuItem: {
          key: 'serial',
          content: (
            <>
              <Label>{serials.length}</Label> Serials
            </>
          ),
        },
        render: () =>
          this.renderTab(
            serials,
            [
              { title: '', field: '', formatter: this.viewDetails },
              { title: 'ID', field: 'pid' },
              { title: 'Title', field: 'title' },
              { title: 'Type', field: 'pid_type' },
              { title: 'Volume', field: 'volume' },
            ],
            'related serials',
            this.getEditButton('serials')
          ),
      },
    ];
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Tab
            id="document-relations"
            menu={{
              secondary: true,
              pointing: true,
            }}
            panes={this.getTabPanes()}
            activeIndex={this.state.activeIndex}
            onTabChange={(_, { activeIndex }) => this.onTabChange(activeIndex)}
          />
        </Error>
      </Loader>
    );
  }
}

DocumentRelations.propTypes = {
  relations: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};

DocumentRelations.defaultProps = {
  showMaxRows: 5,
};
