import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Error,
  Loader,
  ResultsTable,
  Pagination,
} from '../../../../../../common/components';
import { Tab, Label, Input } from 'semantic-ui-react';
import { ManageRelationsButton } from '../../../../../../common/components/ManageRelationsButton';
import {
  formatPidTypeToName,
  getRelationTypeByName,
} from '../../../../../../common/components/ManageRelationsButton/utils';
import { ESSelectorModal } from '../../../../../../common/components/ESSelector';
import {
  document as documentApi,
  series as seriesApi,
} from '../../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import { goTo } from '../../../../../../history';
import { formatter } from '../../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import capitalize from 'lodash/capitalize';
import ESRelatedSelector from '../../../../../../common/components/ESSelector/ESRelatedSelector';
import {
  parentChildRelationPayload,
  siblingRelationPayload,
} from '../../../../../../common/api/utils';
import './SeriesRelations.scss';
import {
  serializeDocument,
  serializeSeries,
  serializeSeriesLanguages,
} from '../../../../../../common/components/ESSelector/serializer';

export const serializeEdition = hit => {
  const pidType = hit.metadata.pidType;
  const result =
    pidType === 'docid' ? serializeDocument(hit) : serializeSeries(hit);
  result.description = `Edition: ${hit.metadata.edition || '-'}`;

  return result;
};

export const serializeLanguageSelection = selection => {
  if (!selection.metadata.extraFields.language) {
    selection.metadata.extraFields.language = selection.metadata.language;
  }
  selection.description = `Language: ${selection.metadata.extraFields
    .language || '-'}`;
  return selection;
};

export const serializeEditionSelection = selection => {
  if (!selection.metadata.extraFields.edition) {
    selection.metadata.extraFields.edition = selection.metadata.edition;
  }
  selection.description = `Edition: ${selection.metadata.extraFields.edition ||
    '-'}`;
  return selection;
};

export const serializeSeriesSelection = selection => {
  if (!selection.metadata.extraFields.volume) {
    selection.metadata.extraFields.volume = selection.metadata.volume;
  }
  selection.description = `Volume: ${selection.metadata.extraFields.volume ||
    '-'}`;
  return selection;
};

export default class SeriesRelations extends Component {
  state = {
    activeIndex: 0,
    activePage: {},
    removedRelations: [],
  };

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

  onRelatedClick = row => {
    const pid = row.ID;
    const type = row.Type;
    let detailsFor;
    if (type === 'Document') {
      detailsFor = BackOfficeRoutes.documentDetailsFor;
    } else if (type === 'Series') {
      detailsFor = BackOfficeRoutes.seriesDetailsFor;
    } else {
      console.warn(`Unknown pid type: ${type}`);
    }
    return goTo(detailsFor(pid), { pid: pid, type: type });
  };

  getPaginator(totalResults, activePage) {
    return (
      <Pagination
        currentPage={activePage}
        currentSize={this.props.showMaxRows}
        loading={this.props.isLoading}
        totalResults={totalResults}
        onPageChange={this.onPageChange}
      />
    );
  }

  getEditButton = key => {
    const buttons = {
      editions: (
        <ManageRelationsButton
          SelectorModal={ESSelectorModal}
          Selector={ESRelatedSelector}
          enabled={true}
          config={{
            modal: {
              title: 'Manage related editions',
              content: 'Select related editions.',
            },
            recordTypes: {
              Document: {
                pidType: 'docid',
                serializeSelection: serializeEditionSelection,
                selectorProps: {
                  query: documentApi.list,
                  serializer: serializeEdition,
                },
              },
              'Multipart monograph': {
                pidType: 'serid',
                serializeSelection: serializeEditionSelection,
                selectorProps: {
                  query: seriesApi.multipartMonographs,
                  serializer: serializeEdition,
                },
              },
            },
          }}
          editButtonLabel={'Edit edition relations'}
          initialSelections={this.getSelections('edition')}
          relation="edition"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
      ),
      languages: (
        <ManageRelationsButton
          SelectorModal={ESSelectorModal}
          Selector={ESRelatedSelector}
          enabled={true}
          config={{
            modal: {
              title: 'Manage related languages',
              content: 'Select related languages.',
            },
            recordTypes: {
              'Multipart monograph': {
                pidType: 'serid',
                serializeSelection: serializeLanguageSelection,
                selectorProps: {
                  query: seriesApi.multipartMonographs,
                  serializer: serializeSeriesLanguages,
                },
              },
            },
          }}
          editButtonLabel={'Edit language relations'}
          initialSelections={this.getSelections('language')}
          relation="language"
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
          editButtonLabel={'Edit serials relations'}
          initialSelections={this.getSelections('serial')}
          relation="serial"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
      ),
    };
    return buttons[key];
  };

  renderTab = (rows, name, editButton) => {
    const activePage = this.activePage;
    const size = this.props.showMaxRows;
    const activeRows = rows.slice((activePage - 1) * size, activePage * size);
    activeRows.totalHits = rows.length;
    return (
      <Tab.Pane>
        {editButton}
        <ResultsTable
          rows={activeRows}
          name={name}
          renderSegment={false}
          showMaxRows={size}
          paginationComponent={this.getPaginator(rows.length, activePage)}
          rowActionClickHandler={this.onRelatedClick}
          currentPage={activePage}
        />
      </Tab.Pane>
    );
  };

  getSelections(relationName) {
    const selections = [];
    if (this.props.relations[relationName]) {
      const relations = this.props.relations[relationName];

      for (const obj of relations) {
        const id = `${obj.pid}-${obj.pid_type}-${relationName}`;
        const type = formatPidTypeToName(obj.pid_type);
        const extraFields = {};
        for (const key in obj) {
          if (!['pid', 'pid_type', 'title'].includes(key)) {
            extraFields[key] = obj[key];
          }
        }
        selections.push({
          id: id,
          key: id,
          title: obj.title,
          description: `${relationName}`,
          extra: `${type} #${obj.pid}`,
          metadata: {
            pid: obj.pid,
            pidType: obj.pid_type,
            relationType: relationName,
            title: obj.title,
            extraFields: extraFields,
          },
        });
      }
    }
    return selections;
  }

  getTabRows(relation, pickColumns) {
    const rows = [];
    if (!this.props.relations[relation]) return [];

    for (const obj of this.props.relations[relation]) {
      const record = formatter.related.toTable(
        obj,
        getRelationTypeByName(relation).label
      );
      rows.push(pick(record, pickColumns));
    }
    return rows;
  }

  generateActions(results, type) {
    const actions = [];
    const moi = this.props.series.metadata.mode_of_issuance;

    const generateCreatePayload = relationType => {
      if (['serial', 'multipart_monograph'].includes(relationType))
        return parentChildRelationPayload;
      return siblingRelationPayload;
    };

    for (const result of results) {
      const relation = result.metadata.relationType;
      const createPayload = generateCreatePayload(relation);
      const addAction =
        type === 'create' ? result.metadata.new : !result.metadata.new;
      if (addAction) {
        let first = result;
        let second = this.props.series;
        if (
          (relation === 'serial' && moi === 'SERIAL') ||
          (relation === 'multipart_monograph' && moi === 'MULTIPART_MONOGRAPH')
        ) {
          first = this.props.series;
          second = result;
        }
        actions.push(
          createPayload(
            result.metadata.relationType,
            result.metadata.extraFields,
            first,
            second
          )
        );
      }
    }
    return actions;
  }

  onSave = results => {
    const createRelations = this.generateActions(results, 'create');
    const deleteRelations = this.generateActions(
      this.state.removedRelations,
      'delete'
    );
    const pid = this.props.series.pid;
    this.props.createRelations(pid, createRelations);
    this.props.deleteRelations(pid, deleteRelations);
    this.setState({ removedRelations: [] });
  };

  onRemoveSelection = selection => {
    const removedRelations = this.state.removedRelations;
    removedRelations.push(selection);
    this.setState({ removedRelations });
  };

  getMultipartTabPanes() {
    const editions = this.getTabRows('edition', [
      'ID',
      'Title',
      'Type',
      'Edition',
    ]);
    const serials = this.getTabRows('serial', [
      'ID',
      'Title',
      'Type',
      'Volume',
    ]);

    const languages = this.getTabRows('language', [
      'ID',
      'Title',
      'Type',
      'Language',
    ]);

    const activeIndex = this.state.activeIndex;

    return [
      {
        menuItem: {
          key: 'edition',
          content: (
            <>
              <Label>{editions.length}</Label>
              Editions
            </>
          ),
        },
        render: () =>
          this.renderTab(
            editions,
            'related editions',
            this.getEditButton('editions')
          ),
      },
      {
        menuItem: {
          key: 'language',
          content: (
            <>
              <Label>{languages.length}</Label>
              Languages
            </>
          ),
        },
        render: () =>
          this.renderTab(
            languages,
            'related languages',
            this.getEditButton('languages')
          ),
      },
      {
        menuItem: {
          key: 'serial',
          content: (
            <>
              <Label>{serials.length}</Label>
              Serials
            </>
          ),
        },
        render: () =>
          this.renderTab(
            serials,
            'related serials',
            this.getEditButton('serials')
          ),
      },
    ];
  }

  getSerialTabPanes() {
    return [];
  }

  renderTabs() {
    let panes = [];
    if (!isEmpty(this.props.series)) {
      panes =
        this.props.series.metadata.mode_of_issuance === 'SERIAL'
          ? this.getSerialTabPanes()
          : this.getMultipartTabPanes();
    }
    return (
      <Tab
        id="series-relations"
        menu={{
          secondary: true,
          pointing: true,
        }}
        panes={panes}
        activeIndex={this.state.activeIndex}
        onTabChange={(_, { activeIndex }) => this.onTabChange(activeIndex)}
      />
    );
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTabs()}</Error>
      </Loader>
    );
  }
}

SeriesRelations.propTypes = {
  relations: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};

SeriesRelations.defaultProps = {
  showMaxRows: 5,
};
