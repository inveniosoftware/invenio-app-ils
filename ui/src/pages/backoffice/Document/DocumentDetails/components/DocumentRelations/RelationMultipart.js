import { series as seriesApi } from '@api';
import { parentChildRelationPayload, siblingRelationPayload } from '@api/utils';
import { ResultsTable } from '@components';
import { ESSelectorModal } from '@components/ESSelector';
import ESRelatedSelector from '@components/ESSelector/ESRelatedSelector';
import { serializeSeries } from '@components/ESSelector/serializer';
import { ManageRelationsButton } from '@pages/backoffice/components/ManageRelationsButton';
import { getSelections } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Tab } from 'semantic-ui-react';

export class RelationMultipart extends Component {
  constructor(props) {
    super(props);
  }

  serializeSelection = selection => {
    if (!selection.metadata.extraFields.volume) {
      selection.metadata.extraFields.volume = selection.metadata.volume;
    }
    selection.description = `Volume: ${selection.metadata.extraFields.volume ||
      '-'}`;
    return selection;
  };

  onRemoveSelection = selection => {
    const removedRelations = this.state.removedRelations;
    removedRelations.push(selection);
    this.setState({ removedRelations });
  };

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
            this.props.documentDetails
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
            this.props.documentDetails
          )
        );
      }
    }
    const pid = this.props.documentDetails.pid;
    this.props.createRelations(pid, createRelations);
    this.props.deleteRelations(pid, deleteRelations);
    this.setState({ removedRelations: [] });
  };

  render() {
    const activePage = this.activePage;
    const size = this.props.showMaxRows;
    const activeRows = rows.slice((activePage - 1) * size, activePage * size);
    return (
      <Tab.Pane>
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
                serializeSelection: this.serializeSelection,
                selectorProps: {
                  query: seriesApi.multipartMonographs,
                  serializer: serializeSeries,
                },
              },
            },
          }}
          initialSelections={getSelections('multipart_monograph')}
          relation="multipart_monograph"
          onRemoveSelection={this.onRemoveSelection}
          onSave={this.onSave}
        />
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
  }
}
