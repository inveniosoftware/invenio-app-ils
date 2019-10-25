import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Header,
  Icon,
  Image,
  Message,
  Item,
  Label,
  List,
} from 'semantic-ui-react';
import { getCover } from '../../../frontsite/config';
import { BackOfficeRoutes } from '../../../../routes/urls';
import _isEmpty from 'lodash/isEmpty';

class Stats extends Component {
  render() {
    const { metadata } = this.props;
    return (
      <List verticalAlign="middle" style={{ color: '#aaa' }}>
        <List.Item>
          <List.Content floated="right">
            <Header style={{ color: '#aaa' }}>
              {metadata.loan_extensions}
            </Header>
          </List.Content>
          <List.Content>total extensions</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
            <Header as={Link} to={metadata.loan_count_url}>
              {metadata.loan_count}
            </Header>
          </List.Content>
          <List.Content>total loans</List.Content>
        </List.Item>
      </List>
    );
  }
}

class Circulation extends Component {
  renderOverbookIcon = isOverbooked => {
    const name = isOverbooked ? 'check' : 'minus';
    const color = isOverbooked ? 'green' : 'grey';
    return (
      <Icon name={name} color={color} size="small" style={{ margin: 0 }} />
    );
  };

  render() {
    const { circulation } = this.props;
    return (
      <List verticalAlign="middle" style={{ color: '#aaa' }}>
        <List.Item>
          <List.Content floated="right">
            <strong>{circulation.has_items_for_loan}</strong>
          </List.Content>
          <List.Content>available items</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
            <strong>{circulation.active_loans}</strong>
          </List.Content>
          <List.Content>active loans</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
            <strong>{circulation.pending_loans}</strong>
          </List.Content>
          <List.Content>pending loans</List.Content>
        </List.Item>
        <List.Item>
          <List.Content floated="right">
            {this.renderOverbookIcon(circulation.overbooked)}
          </List.Content>
          <List.Content>overbooked</List.Content>
        </List.Item>
      </List>
    );
  }
}

class DocumentListEntry extends Component {
  getSpecificFields = document =>
    document.metadata.loan_count ? (
      <Stats metadata={document.metadata} />
    ) : (
      <Circulation circulation={document.metadata.circulation} />
    );

  getRestrictions = meta => {
    if (_isEmpty(meta._access)) return null;
    return {
      corner: 'left',
      color: 'red',
      icon: 'lock',
      title: `This ${meta.document_type.toLowerCase()} is restricted`,
    };
  };

  renderLanguages = langs => {
    if (_isEmpty(langs)) return null;
    return (
      <Item.Description>
        langs&nbsp;
        {langs.map(lang => `${lang}, `.toUpperCase())}
      </Item.Description>
    );
  };

  renderEdition = edition => {
    if (!edition) return null;
    return (
      <Item.Description>
        edition&nbsp;<strong>{edition}</strong>
      </Item.Description>
    );
  };

  renderTags = tags => {
    if (_isEmpty(tags)) return null;
    return (
      <Item.Meta>
        {tags.map(tag => (
          <Label
            as={Link}
            className={'highlighted'}
            key={tag.pid}
            size={'small'}
            content={tag.name}
            to={BackOfficeRoutes.documentsListWithQuery(
              '&sort=mostrecent&order=desc&aggr[0][tags][value]=tags.' +
                tag.name
            )}
          />
        ))}
      </Item.Meta>
    );
  };

  render() {
    const { document } = this.props;
    return (
      <Grid.Row columns={2}>
        <Grid.Column width={3} textAlign={'center'}>
          <Image
            as={Link}
            to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
            size={'tiny'}
            src={getCover(document.metadata.pid)}
            onError={e => (e.target.style.display = 'none')}
            label={this.getRestrictions(document.metadata)}
          />
          <Header disabled sub style={{ marginTop: '2px' }}>
            {document.metadata.document_type}
          </Header>
          <Header disabled sub style={{ marginTop: '2px' }}>
            #{document.metadata.pid}
          </Header>
        </Grid.Column>

        <Grid.Column width={13}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header
                  as={Link}
                  to={BackOfficeRoutes.documentDetailsFor(
                    document.metadata.pid
                  )}
                  data-test={`navigate-${document.metadata.pid}`}
                >
                  {document.metadata.title}
                </Item.Header>
                );
                <Item.Meta>
                  by {document.metadata.authors.map(author => author.full_name)}
                </Item.Meta>
                <Grid columns={2}>
                  <Grid.Column>
                    {this.renderLanguages(document.metadata.languages)}
                    {this.renderEdition(document.metadata.edition)}
                  </Grid.Column>
                  <Grid.Column width={5}>
                    {this.getSpecificFields(document)}
                  </Grid.Column>
                </Grid>
                {this.renderTags(document.metadata.tags)}
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export class DocumentList extends Component {
  render() {
    const { hits } = this.props;
    if (!hits.length)
      return <Message data-test="no-results">There are no documents.</Message>;

    return (
      <Grid>
        {hits.map(hit => {
          return <DocumentListEntry document={hit} key={hit.id} />;
        })}
      </Grid>
    );
  }
}
