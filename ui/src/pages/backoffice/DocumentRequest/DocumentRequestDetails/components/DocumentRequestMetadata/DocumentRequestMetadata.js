import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { MetadataTable } from '@pages/backoffice/components/MetadataTable';
import { BackOfficeRoutes } from '@routes/urls';

export default class DocumentRequestMetadata extends Component {
  addRow(rows, name, value) {
    if (value) {
      rows.push({ name, value });
    }
  }

  leftColumn() {
    const { data } = this.props;
    const patronLink = (
      <Link to={BackOfficeRoutes.patronDetailsFor(data.metadata.patron_pid)}>
        {data.metadata.patron.name}
      </Link>
    );
    const rows = [
      { name: 'Title', value: data.metadata.title },
      { name: 'State', value: data.metadata.state },
      { name: 'Patron', value: patronLink },
    ];
    this.addRow(rows, 'Edition', data.metadata.edition);
    this.addRow(rows, 'Standard Number', data.metadata.standard_number);
    this.addRow(rows, 'ISBN', data.metadata.isbn);
    this.addRow(rows, 'ISSN', data.metadata.issn);
    return rows;
  }

  rightColumn() {
    const { data } = this.props;
    const rows = [];
    this.addRow(rows, 'Authors', data.metadata.authors);
    this.addRow(rows, 'Volume', data.metadata.volume);
    this.addRow(rows, 'Journal Title', data.metadata.journal_title);
    this.addRow(rows, 'Page', data.metadata.page);
    this.addRow(rows, 'Publication Year', data.metadata.publication_year);
    this.addRow(rows, 'Note', data.metadata.note);
    this.addRow(rows, 'Reject Reason', data.metadata.reject_reason);
    return rows;
  }

  render() {
    return (
      <Grid padded columns={2}>
        <Grid.Row>
          <Grid.Column>
            <MetadataTable rows={this.leftColumn()} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable rows={this.rightColumn()} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

DocumentRequestMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};
