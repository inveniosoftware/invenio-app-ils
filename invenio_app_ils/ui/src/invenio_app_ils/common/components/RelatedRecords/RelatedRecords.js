import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../components';
import { ResultsTable } from '../../components';
import { BackOfficeRoutes } from '../../../routes/urls';
import { SeeAllButton } from '../../../pages/backoffice/components/buttons';
import { goTo } from '../../../history';
import { formatter } from '../ResultsTable/formatters';
import pick from 'lodash/pick';
import truncate from 'lodash/truncate';
import { Grid, Button } from 'semantic-ui-react';
import { recordToPid } from '../../api/utils';
import ESRelatedSelector from '../ESSelector/ESRelatedSelector';

export default class RelatedRecords extends Component {
  constructor(props) {
    super(props);
    this.fetchRelatedRecords = props.fetchRelatedRecords;
    this.showDetailsUrl = BackOfficeRoutes.itemDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.itemsListWithQuery;
    this.state = {
      removedRelatedRecords: [],
      showMaxRelatedEditions: props.showMaxRelatedRecords,
      showMaxRelatedTranslations: props.showMaxRelatedRecords,
    };
  }

  componentDidMount() {
    const [pid, pidType] = recordToPid(this.props.record);
    this.fetchRelatedRecords(pid, pidType);
  }

  onAllEditionsClick = () => {
    this.setState({ showMaxRelatedEditions: 10 });
  };

  onAllTranslationsClick = () => {
    this.setState({ showMaxRelatedTranslations: 10 });
  };

  seeAllButton = onClick => {
    return <SeeAllButton clickHandler={onClick} />;
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

  onRemoveRelatedSelection = selection => {
    const removed = this.state.removedRelatedRecords;
    removed.push(selection);
    this.setState({ removedRelatedRecords: removed });
  };

  updateRelatedRecords = results => {
    const resultToAction = (result, action) => ({
      pid: result.metadata.pid,
      pid_type: result.metadata.pidType,
      relation_type: result.metadata.relationType,
      action: action,
    });
    const updatedRecords = [];
    for (const result of results) {
      if (result.metadata.new) {
        updatedRecords.push(resultToAction(result, 'add'));
      }
    }
    for (const result of this.state.removedRelatedRecords) {
      if (!result.metadata.new) {
        updatedRecords.push(resultToAction(result, 'remove'));
      }
    }
    const [pid, pidType] = recordToPid(this.props.record);
    this.props.updateRelatedRecords(pid, pidType, updatedRecords);
    this.setState({ removedRelatedRecords: [] });
  };

  prepareData(data) {
    const editions = [];
    const translations = [];
    const initialSelections = [];
    for (let obj of data.metadata.related_records) {
      const record = formatter.related.toTable(obj);
      if (record.Relation === 'Edition') {
        editions.push(pick(record, ['ID', 'Type', 'Title', 'Edition']));
      } else if (record.Relation === 'Translation') {
        translations.push(pick(record, ['ID', 'Type', 'Title', 'Language']));
      } else {
        console.warn(`Unknown record relation: ${record}`);
      }
      const id = `${obj.pid}-${obj.pid_type}-${obj.relation_type}`;
      initialSelections.push({
        id: id,
        key: id,
        title: truncate(obj.title, { length: 50 }),
        description: `${record.Type}`,
        extra: `PID: ${obj.pid}`,
        metadata: {
          pid: obj.pid,
          pidType: obj.pid_type,
          relationType: obj.relation_type,
        },
      });
    }
    return [editions, translations, initialSelections];
  }

  renderTable(data) {
    const [editions, translations, initialSelections] = this.prepareData(data);
    const seeAllEditions = this.seeAllButton(
      this.onAllEditionsClick,
      editions.length
    );
    const seeAllTranslations = this.seeAllButton(
      this.onAllTranslationsClick,
      translations.length
    );
    const { SelectorModal } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <ResultsTable
              rows={editions}
              title={'Related editions'}
              name={'related editions'}
              rowActionClickHandler={this.onRelatedClick}
              seeAllComponent={seeAllEditions}
              showMaxRows={this.state.showMaxRelatedEditions}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <ResultsTable
              rows={translations}
              title={'Related translations'}
              name={'related translations'}
              rowActionClickHandler={this.onRelatedClick}
              seeAllComponent={seeAllTranslations}
              showMaxRows={this.state.showMaxRelatedTranslations}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={13} />
          <Grid.Column width={3}>
            {SelectorModal && (
              <SelectorModal
                multiple
                selectorComponent={ESRelatedSelector}
                initialSelections={initialSelections}
                trigger={<Button color="blue" content="Manage related" />}
                title="Select Related"
                size="small"
                content={
                  'Select related documents/series and their type of relation.'
                }
                onRemoveSelection={this.onRemoveRelatedSelection}
                onSave={this.updateRelatedRecords}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable(data)}</Error>
      </Loader>
    );
  }
}

RelatedRecords.propTypes = {
  record: PropTypes.object.isRequired,
  fetchRelatedRecords: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRelatedRecords: PropTypes.number,
  SelectorModal: PropTypes.func.isRequired,
};

RelatedRecords.defaultProps = {
  showMaxRelatedRecords: 5,
};
