import React, { Component } from 'react';
import { Icon, Table, Message } from 'semantic-ui-react';
import { Error } from '../../../../common/components';
import { http } from '../../../../common/api/base';
import { DocumentApis } from '../../../../routes/urls';

export class DocumentStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { views: { count: '-', unique_count: '-' } },
      error: {},
    };
  }

  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = async () => {
    const { document } = this.props;
    const request = {
      views: {
        stat: 'record-view',
        params: {
          pid_value: document.pid,
        },
      },
    };
    try {
      const response = await http.post(DocumentApis.statsUrl, request);
      this.setState({ data: response.data });
    } catch (error) {
      this.setState({ error: error });
    }
  };

  render() {
    const { document } = this.props;
    const { data, error } = this.state;
    return (
      <Error error={error}>
        <Message compact className={'document-stats-message'}>
          <Table compact basic>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Icon name="eye" />
                </Table.Cell>
                <Table.Cell>
                  Views <strong>{data.views.count}</strong>
                </Table.Cell>
                <Table.Cell>
                  Unique Views <strong>{data.views.unique_count}</strong>
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
      </Error>
    );
  }
}
