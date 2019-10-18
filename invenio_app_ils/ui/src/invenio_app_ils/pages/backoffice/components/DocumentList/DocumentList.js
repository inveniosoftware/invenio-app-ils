import React from 'react';
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
import { getCover, CARD_IMAGE_SIZE } from '../../../frontsite/config';
import { BackOfficeRoutes } from '../../../../routes/urls';
import _isEmpty from 'lodash/isEmpty';

const getRestrictions = meta => {
  if (_isEmpty(meta._access)) return null;
  return {
    corner: 'left',
    color: 'red',
    icon: 'lock',
    title: `This ${meta.document_type.toLowerCase()} is restricted`,
  };
};

const Title = ({ document }) => (
  <Item.Header
    as={Link}
    to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
    data-test={`navigate-${document.metadata.pid}`}
  >
    {document.metadata.title}
  </Item.Header>
);

const Authors = ({ authors }) => (
  <Item.Meta>by {authors.map(author => author.full_name)}</Item.Meta>
);

const Languages = ({ languages }) => {
  if (_isEmpty(languages)) return null;
  return (
    <Item.Description>
      languages&nbsp;
      {languages.map(lang => `${lang}, `.toUpperCase())}
    </Item.Description>
  );
};

const Edition = ({ edition }) => {
  if (!edition) return null;
  return (
    <Item.Description>
      edition&nbsp;<strong>{edition}</strong>
    </Item.Description>
  );
};

const Tags = ({ tags }) => {
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
            '&sort=mostrecent&order=desc&aggr[0][tags][value]=tags.' + tag.name
          )}
        />
      ))}
    </Item.Meta>
  );
};

const OverbookIcon = ({ isOverbooked }) => {
  const name = isOverbooked ? 'check' : 'minus';
  const color = isOverbooked ? 'green' : 'grey';
  return <Icon name={name} color={color} size="small" style={{ margin: 0 }} />;
};

const Stats = ({ metadata }) => {
  return (
    <List verticalAlign="middle" style={{ color: '#aaa' }}>
      <List.Item>
        <List.Content floated="right">
          <Header style={{ color: '#aaa' }}>{metadata.loan_extensions}</Header>
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
};

const Circulation = ({ circulation }) => {
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
          <OverbookIcon isOverbooked={circulation.overbooked} />
        </List.Content>
        <List.Content>overbooked</List.Content>
      </List.Item>
    </List>
  );
};

const getExtra = document =>
  document.metadata.loan_count ? (
    <Stats metadata={document.metadata} />
  ) : (
    <Circulation circulation={document.metadata.circulation} />
  );

const DocumentListEntry = ({ document }) => {
  return (
    <Grid.Row columns={2}>
      <Grid.Column width={3} textAlign={'center'}>
        <Image
          as={Link}
          to={BackOfficeRoutes.documentDetailsFor(document.metadata.pid)}
          size={CARD_IMAGE_SIZE}
          src={getCover(document.metadata.pid)}
          onError={e => (e.target.style.display = 'none')}
          label={getRestrictions(document.metadata)}
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
              <Title document={document} />
              <Authors authors={document.metadata.authors} />
              <Grid columns={2}>
                <Grid.Column>
                  <Languages languages={document.metadata.languages} />
                  <Edition edition={document.metadata.edition} />
                </Grid.Column>
                <Grid.Column width={5}>{getExtra(document)}</Grid.Column>
              </Grid>
              <Tags tags={document.metadata.tags} />
            </Item.Content>
          </Item>
        </Item.Group>
      </Grid.Column>
    </Grid.Row>
  );
};

export function DocumentList(props) {
  const { hits } = props;
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
