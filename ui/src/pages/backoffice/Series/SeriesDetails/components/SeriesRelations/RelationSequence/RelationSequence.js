import { Error, Loader } from '@components';
import { DocumentTitle } from '@components/Document';
import { InfoMessage, SeriesDetailsLink } from '@pages/backoffice/components';
import {
  ExistingRelations,
  RelationRemover,
} from '@pages/backoffice/components/Relations';
import _get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import { RelationSequenceModal } from '../RelationSequence';

export default class RelationSequence extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'sequence';
  }

  viewDetails = ({ row }) => {
    const titleCmp = <DocumentTitle metadata={row.record_fields} />;
    return (
      <SeriesDetailsLink pidValue={row.pid_value}>{titleCmp}</SeriesDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { seriesDetails } = this.props;

    if (!isEmpty(seriesDetails)) {
      return (
        <RelationRemover
          referrer={seriesDetails}
          related={row}
          relationType={row.relation_type}
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;

    const sequenceRelations = _get(relations, 'sequence', []);
    const continuations = sequenceRelations.filter(
      rel => rel.relation_order === 'is_continued_by'
    );
    const predecessors = sequenceRelations.filter(
      rel => rel.relation_order === 'continues'
    );

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationSequenceModal relationType={this.relationType} />
          <Grid columns={2} relaxed="very">
            <Grid.Column width={8}>
              <Divider horizontal>Predecessors of this serial </Divider>
              <ExistingRelations
                rows={predecessors}
                showMaxRows={showMaxRows}
                columns={columns}
                emptyMessage={
                  <InfoMessage
                    header={'No predecessors'}
                    content={'Use the button above to add sequence relations.'}
                  />
                }
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Divider horizontal>Continuations of this serial </Divider>
              <ExistingRelations
                rows={continuations}
                showMaxRows={showMaxRows}
                columns={columns}
                emptyMessage={
                  <InfoMessage
                    header={'No continuations'}
                    content={'Use the button above to add sequence relations.'}
                  />
                }
              />
            </Grid.Column>
          </Grid>
        </Error>
      </Loader>
    );
  }
}

RelationSequence.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  seriesDetails: PropTypes.object.isRequired,
};

RelationSequence.defaultProps = {
  showMaxRows: 3,
};
