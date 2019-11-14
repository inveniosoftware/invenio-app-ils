import React, { Component } from 'react';
import { Icon, Table, Message } from 'semantic-ui-react';
import { stats } from '@api/stats/stats';
import { recordToPidType } from '@api/utils';
import _get from 'lodash/get';

export class DocumentStats extends Component {
  constructor(props) {
    super(props);
    this.state = { views: { count: '-', unique_count: '-' } };
  }

  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = async () => {
    const { document } = this.props;
    const pidType = recordToPidType(document);
    try {
      const response = await stats.recordStats(pidType, document.pid);
      const views = _get(response.data, 'views', {
        count: '-',
        unique_count: '-',
      });
      this.setState({ views: views });
    } catch (error) {
      console.warn(error);
    }
  };

  render() {
    const { document } = this.props;
    const { views } = this.state;
    return (
      <Message compact className={'document-stats-message'}>
        <Table compact basic>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Icon name="eye" />
              </Table.Cell>
              <Table.Cell>
                Views <strong>{views.count}</strong>
              </Table.Cell>
              <Table.Cell>
                Unique Views <strong>{views.unique_count}</strong>
              </Table.Cell>
            </Table.Row>

            {document.metadata.eitems.hits.length > 0 && (
              <Table.Row>
                <Table.Cell>
                  <Icon name="download" />
                </Table.Cell>
                <Table.Cell>
                  Downloads <strong>{'-'}</strong>
                </Table.Cell>
                <Table.Cell>
                  Unique Downloads <strong>{'-'}</strong>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Message>
    );
  }
}
