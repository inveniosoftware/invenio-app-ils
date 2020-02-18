import { DeleteRecordModal } from '@pages/backoffice';
import { DeleteButton } from '@pages/backoffice/components/DeleteRecordModal/components/DeleteButton';
import { formatPidTypeToName } from '@pages/backoffice/components/ManageRelationsButton/utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const deleteButton = props => {
  return (
    <DeleteButton
      fluid
      content="Delete series"
      labelPosition="left"
      {...props}
    />
  );
};

export class SeriesDeleteModal extends Component {
  async getRelationRefs() {
    const hits = [];
    for (const [relation, records] of Object.entries(this.props.relations)) {
      for (const record of records) {
        const type = formatPidTypeToName(record.pid_type);
        hits.push({
          id: `${type} ${record.pid} (${relation})`,
          record: record,
          type: type,
        });
      }
    }
    const obj = {
      data: {
        hits: hits,
        total: hits.length,
      },
    };
    return obj;
  }

  createRefProps() {
    return [
      {
        refType: 'Related',
        onRefClick: () => {},
        getRefData: () => this.getRelationRefs(),
      },
    ];
  }
  render() {
    const { series } = this.props;
    return (
      <DeleteRecordModal
        deleteHeader={`Are you sure you want to delete the Series record
            with ID ${series.pid}?`}
        refProps={this.createRefProps()}
        onDelete={() => this.props.deleteSeries(series.pid)}
        trigger={deleteButton}
      />
    );
  }
}

SeriesDeleteModal.propTypes = {
  series: PropTypes.object.isRequired,
  relations: PropTypes.object.isRequired,
};
