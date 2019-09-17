import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Error,
  Loader,
  ResultsTable,
  Pagination,
} from '../../../../../common/components';
import { Tab, Label, Input } from 'semantic-ui-react';
import { ManageRelationsButton } from '../../../../../common/components/ManageRelationsButton';
import { ESSelectorModal } from '../../../../../common/components/ESSelector';
import {
  document as documentApi,
  series as seriesApi,
} from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { goTo } from '../../../../../history';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';
import capitalize from 'lodash/capitalize';
import ESRelatedSelector from '../../../../../common/components/ESSelector/ESRelatedSelector';
import {
  parentChildRelationPayload,
  siblingRelationPayload,
} from '../../../../../common/api/utils';
import {
  formatPidTypeToName,
  getRelationTypeByName,
} from '../../../../../common/components/ManageRelationsButton/utils';
import {
  serializeDocument,
  serializeSeries,
} from '../../../../../common/components/ESSelector/serializer';

export const serializeEdition = hit => {
  const pidType = hit.metadata.pidType;
  const result =
    pidType === 'docid' ? serializeDocument(hit) : serializeSeries(hit);
  result.description = `Edition: ${hit.metadata.edition || '-'}`;

  return result;
};

export const serializeLanguage = hit => {
  const result = serializeDocument(hit);
  result.description = `Languages: ${hit.metadata.language || '-'}`;
  return result;
};

export const serializeSelection = selection => {
  const extras = Object.entries(selection.metadata.extraFields);
  selection.description = extras
    .map(([name, value]) => `${capitalize(name)}: ${value}`)
    .join(', ');
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

export const serializeLanguageSelection = selection => {
  if (!selection.metadata.extraFields.language) {
    selection.metadata.extraFields.language = selection.metadata.language;
  }
  selection.description = `Language: ${selection.metadata.extraFields
    .language || '-'}`;
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

export default class DocumentRelations extends Component {
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
      edition: (
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
          initialSelections={this.getSelections('edition')}
          relation="edition"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
      ),
      language: (
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
              Document: {
                pidType: 'docid',
                serializeSelection: serializeLanguageSelection,
                selectorProps: {
                  query: documentApi.list,
                  serializer: serializeLanguage,
                },
              },
            },
          }}
          initialSelections={this.getSelections('language')}
          relation="language"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
      ),
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
      other: (
        <ManageRelationsButton
          SelectorModal={ESSelectorModal}
          Selector={ESRelatedSelector}
          enabled={true}
          config={{
            modal: {
              title: 'Manage related others',
              content: 'Select related others.',
              extraFields: {
                note: {
                  component: Input,
                  label: 'Note',
                  props: {
                    placeholder: 'Enter note...',
                  },
                },
              },
            },
            recordTypes: {
              Document: {
                pidType: 'docid',
                serializeSelection: serializeSelection,
                selectorProps: {
                  query: documentApi.list,
                  serializer: serializeDocument,
                },
              },
            },
          }}
          initialSelections={this.getSelections('other')}
          relation="other"
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
          rows={rows}
          name={name}
          renderSegment={false}
          showMaxRows={size}
          paginationComponent={this.getPaginator(rows, activePage)}
          currentPage={activePage}
          rowActionClickHandler={this.onRelatedClick}
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

  onSave = results => {
    const createRelations = [];
    const deleteRelations = [];
    const generateCreatePayload = relationType => {
      if (['serial', 'multipart_monograph'].includes(relationType))
        return parentChildRelationPayload;
      return siblingRelationPayload;
    };
    for (const result of results) {
      const createPayload = generateCreatePayload(result.metadata.relationType);
      if (result.metadata.new) {
        createRelations.push(
          createPayload(
            result.metadata.relationType,
            result.metadata.extraFields,
            result,
            this.props.document
          )
        );
      }
    }
    for (const result of this.state.removedRelations) {
      const createPayload = generateCreatePayload(result.metadata.relationType);
      if (!result.metadata.new) {
        deleteRelations.push(
          createPayload(
            result.metadata.relationType,
            result.metadata.extraFields,
            result,
            this.props.document
          )
        );
      }
    }
    const pid = this.props.document.pid;
    this.props.createRelations(pid, createRelations);
    this.props.deleteRelations(pid, deleteRelations);
    this.setState({ removedRelations: [] });
  };

  onRemoveSelection = selection => {
    const removedRelations = this.state.removedRelations;
    removedRelations.push(selection);
    this.setState({ removedRelations });
  };

  getTabPanes() {
    const editions = this.getTabRows('edition', [
      'ID',
      'Title',
      'Type',
      'Edition',
    ]);
    const languages = this.getTabRows('language', [
      'ID',
      'Title',
      'Type',
      'Language',
    ]);
    const multipartMonographs = this.getTabRows('multipart_monograph', [
      'ID',
      'Title',
      'Type',
      'Volume',
    ]);
    const serials = this.getTabRows('serial', [
      'ID',
      'Title',
      'Type',
      'Volume',
    ]);
    const others = this.getTabRows('other', ['ID', 'Title', 'Type', 'Note']);

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
            this.getEditButton('edition')
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
            this.getEditButton('language')
          ),
      },
      {
        menuItem: {
          key: 'multipart_monograph',
          content: (
            <>
              <Label>{multipartMonographs.length}</Label>
              Multipart monographs
            </>
          ),
        },
        render: () =>
          this.renderTab(
            multipartMonographs,
            'related multipart monographs',
            this.getEditButton('multipart')
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
      {
        menuItem: {
          key: 'other',
          content: (
            <>
              <Label>{others.length}</Label>
              Others
            </>
          ),
        },
        render: () =>
          this.renderTab(others, 'related others', this.getEditButton('other')),
      },
    ];
  }

  renderTabs() {
    return (
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

DocumentRelations.propTypes = {
  relations: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};

DocumentRelations.defaultProps = {
  showMaxRows: 5,
};
