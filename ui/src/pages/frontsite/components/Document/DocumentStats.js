import React, { Component } from 'react';
import { Icon, Table, Message } from 'semantic-ui-react';
import { stats } from '@api/stats';
import { recordToPidType, withCancel } from '@api/utils';
import _get from 'lodash/get';

export class DocumentStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: { count: '-', unique_count: '-' },
      downloads: { count: '-', unique_count: '-' },
    };
  }

  componentDidMount() {
    this.fetchStats();
  }

  componentWillUnmount() {
    this.cancellableFetchStats && this.cancellableFetchStats.cancel();
  }

  fetchStats = async () => {
    const { document } = this.props;
    const pidType = recordToPidType(document);
    try {
      this.cancellableFetchStats = withCancel(
        stats.recordStats(pidType, document.pid)
      );
      const response = await this.cancellableFetchStats.promise;
      const views = _get(response.data, 'views', {
        count: '-',
        unique_count: '-',
      });
      const downloads = _get(response.data, 'downloads', {
        count: '-',
        unique_count: '-',
      });
      if (this._isMounted) {
        this.setState({ downloads: downloads, views: views });
      }
    } catch (error) {
      // the promise might have been cancelled on Unmount
      console.debug(error);
    }
  };

  render() {
    const { document } = this.props;
    const { downloads, views } = this.state;
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

            {document.metadata.eitems.hits && (
              <Table.Row>
                <Table.Cell>
                  <Icon name="download" />
                </Table.Cell>
                <Table.Cell>
                  Downloads <strong>{downloads.count}</strong>
                </Table.Cell>
                <Table.Cell>
                  Unique Downloads <strong>{downloads.unique_count}</strong>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Message>
    );
  }
}
