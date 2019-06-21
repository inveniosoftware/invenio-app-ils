import React, { Component } from 'react';
import { Grid, Icon, Form, Header, Segment, Table } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import { Loader, Error } from '../../../../../common/components';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';

import './DocumentStats.scss';

const DEFAULT_TITLE = 'for all time';

export default class DocumentStats extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentStats = props.fetchDocumentStats;
    this.state = {
      title: DEFAULT_TITLE,
      fromDate: '',
      toDate: '',
    };
  }

  componentDidMount() {
    const { document } = this.props;
    this.fetchDocumentStats({
      documentPid: document.document_pid,
    });
  }

  renderStats() {
    const { isLoading, error, data } = this.props;
    let renewalCount = sumBy(data.hits, loan => loan.metadata.extension_count);
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Table basic="very" textAlign="right">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>past loans</Table.HeaderCell>
                <Table.HeaderCell>renewals</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{data.total}</Table.Cell>
                <Table.Cell>{renewalCount}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Error>
      </Loader>
    );
  }

  buildTitle() {
    let title = '';
    if (this.state.fromDate) {
      title = `from ${this.state.fromDate}`;
    }
    if (this.state.toDate) {
      title = `${title} up to ${this.state.toDate}`;
    }
    if (!this.state.fromDate && !this.state.toDate) {
      title = DEFAULT_TITLE;
    }
    this.setState({ title: title });
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
    if (name === 'fromDate') {
      this.setState({ maxDate: this.state.toDate });
    }
    if (name === 'toDate') {
      this.setState({ minDate: this.state.fromDate });
    }
  };

  handleSubmit = () => {
    const { document } = this.props;
    this.buildTitle();
    this.fetchDocumentStats({
      documentPid: document.document_pid,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
    });
  };

  renderFilters() {
    return (
      <>
        <Header as="h4" textAlign="left">
          Filters
        </Header>
        <Form>
          <Form.Field>
            <DateInput
              autoComplete="off"
              clearable
              clearIcon={<Icon name="remove" color="red" />}
              closable
              dateFormat="YYYY-MM-DD"
              iconPosition="left"
              maxDate={this.state.toDate}
              name="fromDate"
              onChange={this.handleChange}
              placeholder="From Date"
              value={this.state.fromDate}
            />
          </Form.Field>
          <Form.Field>
            <DateInput
              autoComplete="off"
              clearable
              clearIcon={<Icon name="remove" color="red" />}
              closable
              dateFormat="YYYY-MM-DD"
              iconPosition="left"
              minDate={this.state.fromDate}
              name="toDate"
              onChange={this.handleChange}
              placeholder="To Date"
              value={this.state.toDate}
            />
          </Form.Field>
          <Form.Button floated="right" onClick={this.handleSubmit}>
            Submit
          </Form.Button>
        </Form>
      </>
    );
  }

  render() {
    return (
      <Segment className="document-stats">
        <Header as="h3">
          Statistics <small>{this.state.title}</small>
        </Header>
        <Grid columns={2} divided>
          <Grid.Row stretched>
            <Grid.Column width={4} floated="left">
              {this.renderFilters()}
            </Grid.Column>
            <Grid.Column width={12} textAlign="right" floated="right">
              {this.renderStats()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentStats.propTypes = {
  data: PropTypes.object,
};
