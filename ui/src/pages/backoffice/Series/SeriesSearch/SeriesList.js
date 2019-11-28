import { SearchEmptyResults } from '@components/SearchControls';
import { DocumentIcon } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, List, Message } from 'semantic-ui-react';
import { BackOfficeRoutes } from '@routes/urls';
import _isEmpty from 'lodash/isEmpty';
import { DocumentLanguages, DocumentTags } from '@components/Document';

class SeriesListEntry extends Component {
  renderMiddleColumn = series => {
    if (this.props.renderMiddleColumn) {
      return this.props.renderMiddleColumn(series);
    }
    return (
      <>
        <DocumentLanguages
          metadata={series.metadata}
          prefix={<label>languages </label>}
        />
        {this.renderEdition(series.metadata.edition)}
      </>
    );
  };

  renderRightColumn = series => {
    if (this.props.renderRightColumn) {
      return this.props.renderRightColumn(series);
    }
    return this.renderRelations();
  };

  renderRelations = () => {
    const { series } = this.props;
    return (
      <>
        <Item.Description>
          <List verticalAlign={'middle'} className={'series-relations'}>
            {!_isEmpty(series.metadata.relations.serial) && (
              <List.Item>
                <List.Content>
                  <Link
                    to={BackOfficeRoutes.seriesListWithQuery(
                      series.metadata.relations.serial
                        .map((entry, idx) =>
                          idx === series.metadata.relations.serial.length - 1
                            ? `pid: ${entry.pid}`
                            : `pid: ${entry.pid} OR`
                        )
                        .join(' ')
                    )}
                  >
                    Serials <Icon name="folder open outline" />
                  </Link>
                </List.Content>
              </List.Item>
            )}
            {!_isEmpty(series.metadata.relations.edition) && (
              <List.Item>
                <List.Content>
                  <Link
                    to={BackOfficeRoutes.documentsListWithQuery(
                      series.metadata.relations.edition
                        .map((entry, idx) =>
                          idx === series.metadata.relations.edition.length - 1
                            ? `pid: ${entry.pid}`
                            : `pid: ${entry.pid} OR`
                        )
                        .join(' ')
                    )}
                  >
                    {series.metadata.relations.edition.length} editions{' '}
                    <DocumentIcon />
                  </Link>
                </List.Content>

                {!_isEmpty(series.metadata.relations.languages) && (
                  <List.Content>
                    {series.metadata.relations.language.length} languages
                    <Icon name="languages"/>
                  </List.Content>
                )}
              </List.Item>
            )}
          </List>
        </Item.Description>
      </>
    );
  };

  renderEdition = edition => {
    if (!edition) return null;
    return (
      <Item.Description>
        <label>edition</label> {edition}
      </Item.Description>
    );
  };

  render() {
    const { series } = this.props;
    return (
      <Item>

        <Item.Content>
        <Header disabled size={"tiny"} className={'document-type'}>
            {series.metadata.mode_of_issuance}
          </Header><br/>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.seriesDetailsFor(series.metadata.pid)}
            data-test={`navigate-${series.metadata.pid}`}
          >
            {series.metadata.title}
          </Item.Header>
          <Grid columns={3}>
            <Grid.Column computer={6} largeScreen={5}>
              <Item.Meta className={'series-authors'}>
                by{' '}
                <label>
                  {series.metadata.authors.map(author => `${author}`)}
                </label>
              </Item.Meta>

              {series.metadata.issn && (
                <>
                  {' '}
                  <label>ISSN</label> {series.metadata.issn}
                </>
              )}
              <br />
              {series.metadata.isbn && (
                <>
                  {' '}
                  <label>ISBN</label> {series.metadata.isbn}
                </>
              )}
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              {this.renderMiddleColumn(series)}
            </Grid.Column>
            <Grid.Column computer={3} largeScreen={3}>
              {this.renderRightColumn(series)}
            </Grid.Column>
          </Grid>
          <Item.Extra>
            <DocumentTags metadata={series.metadata} />
          </Item.Extra>
        </Item.Content>
        <Item.Meta className={'pid-field'}>
          <Header disabled as="h5" className={'pid-field'}>
            #{series.metadata.pid}
          </Header>
        </Item.Meta>
      </Item>
    );
  }
}

SeriesListEntry.propTypes = {
  series: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};

export default class SeriesList extends Component {
  renderListEntry = series => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(series);
    }
    return <SeriesListEntry key={series.metadata.pid} series={series} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length) return <SearchEmptyResults />;

    return (
      <Item.Group divided className={'bo-series-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}
