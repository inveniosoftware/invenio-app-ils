import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../components';
import { ResultsTable } from '../../components';
import { BackOfficeRoutes } from '../../../routes/urls';
import { SeeAllButton } from '../../../pages/backoffice/components/buttons';
import { goTo } from '../../../history';
import { formatter } from '../ResultsTable/formatters';
import pick from 'lodash/pick';
import { Button, Tab, Label, Container } from 'semantic-ui-react';
import { recordToPid } from '../../api/utils';
import ESRelatedSelector from '../ESSelector/ESRelatedSelector';
import './RelatedRecords.scss';
import {
  EditionRelation,
  LanguageRelation,
  getRelationTypes,
  getIconByRelation,
  getRelationTypeByName,
} from './config';

export default class RelatedRecords extends Component {
  constructor(props) {
    super(props);
    this.fetchRelatedRecords = props.fetchRelatedRecords;
    this.showDetailsUrl = BackOfficeRoutes.itemDetailsFor;
    this.seeAllUrl = BackOfficeRoutes.itemsListWithQuery;
    this.state = {
      removedRelatedRecords: [],
      showMaxRelatedRecords: this.props.showMaxRelatedRecords,
    };
  }

  componentDidMount() {
    const [pid, pidType] = recordToPid(this.props.record);
    this.fetchRelatedRecords(pid, pidType, this.props.showMaxRelatedRecords);
  }

  onSeeAllClick = () => {
    const [pid, pidType] = recordToPid(this.props.record);
    this.setState({ showMaxRelatedRecords: 1000 });
    this.fetchRelatedRecords(pid, pidType);
  };

  seeAllButton = () => {
    return <SeeAllButton clickHandler={this.onSeeAllClick} />;
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
    const records = {};
    const count = data.metadata.related_records_count;
    for (const type of getRelationTypes()) {
      records[type.name] = [];
      if (count) {
        records[type.name].totalHits = count[type.name];
      }
    }
    const initialSelections = [];
    for (let obj of data.metadata.related_records) {
      const record = formatter.related.toTable(
        obj,
        getRelationTypeByName(obj.relation_type)
      );
      if (obj.relation_type === EditionRelation.name) {
        records[obj.relation_type].push(
          pick(record, ['ID', 'Type', 'Title', 'Edition'])
        );
      } else if (obj.relation_type === LanguageRelation.name) {
        records[obj.relation_type].push(
          pick(record, ['ID', 'Type', 'Title', 'Language'])
        );
      } else {
        records[obj.relation_type].push(pick(record, ['ID', 'Type', 'Title']));
      }
      const id = `${obj.pid}-${obj.pid_type}-${obj.relation_type}`;
      initialSelections.push({
        id: id,
        key: id,
        title: obj.title,
        description: `${record.Type}`,
        extra: `PID: ${obj.pid}`,
        metadata: {
          pid: obj.pid,
          pidType: obj.pid_type,
          relationType: obj.relation_type,
        },
      });
    }
    return [records, initialSelections];
  }

  renderTab = (records, name) => (
    <Tab.Pane>
      <ResultsTable
        rows={records}
        name={`related ${name}s`}
        renderSegment={false}
        rowActionClickHandler={this.onRelatedClick}
        seeAllComponent={this.seeAllButton()}
        showMaxRows={this.state.showMaxRelatedRecords}
      />
    </Tab.Pane>
  );

  getTabPanes(records) {
    return getRelationTypes().map(relation => ({
      menuItem: {
        key: relation.name,
        icon: getIconByRelation(relation),
        content: (
          <>
            {relation.label} <Label>{records[relation.name].totalHits}</Label>
          </>
        ),
      },
      render: () => this.renderTab(records[relation.name], relation.name),
    }));
  }

  renderTable(data) {
    const [records, initialSelections] = this.prepareData(data);
    const { SelectorModal } = this.props;
    const menu = {
      secondary: true,
      pointing: true,
      activeIndex: this.state.tabIndex,
    };
    const panes = this.getTabPanes(records);
    panes.push({
      menuItem: (
        <React.Fragment key="manage-related">
          <SelectorModal
            multiple
            selectorComponent={ESRelatedSelector}
            initialSelections={initialSelections}
            trigger={
              <Container>
                <Button color="blue" content="Manage related" />
              </Container>
            }
            title="Select Related"
            size="small"
            content={
              'Select related documents/series and their type of relation.'
            }
            onRemoveSelection={this.onRemoveRelatedSelection}
            onSave={this.updateRelatedRecords}
          />
        </React.Fragment>
      ),
    });
    return (
      <>
        <Tab menu={menu} panes={panes} />
      </>
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
