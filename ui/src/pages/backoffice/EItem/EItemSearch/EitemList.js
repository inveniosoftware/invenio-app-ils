import { DocumentAuthors } from '@components';
import { SearchEmptyResults } from '@components/SearchControls';
import { DocumentIcon, EItemIcon } from '@pages/backoffice';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Item, Label, List } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

class EItemListEntry extends Component {
  render() {
    const { eitem } = this.props;

    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.eitemDetailsFor(eitem.metadata.pid)}
            data-test={`navigate-${eitem.metadata.pid}`}
          >
            <EItemIcon />
            {eitem.metadata.document.title}{' '}
          </Item.Header>
          <Grid columns={4}>
            <Grid.Column computer={6} largeScreen={5}>
              <Item.Meta className={'document-authors'}>
                <DocumentAuthors
                  metadata={eitem.metadata.document}
                  prefix={'by '}
                />
              </Item.Meta>
              {eitem.metadata.doi && (
                <>
                  <label>DOI</label> {eitem.metadata.doi}
                </>
              )}
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              <Item.Meta>
                <List>
                  <List.Item>
                    {!isEmpty(eitem.metadata.files) && (
                      <List.Content>
                        {eitem.metadata.files.length} file(s) attached{' '}
                        <Icon name="file" />
                      </List.Content>
                    )}
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      {!isEmpty(eitem.metadata.urls) && (
                        <List.Content>
                          {eitem.metadata.urls.length} linked resources <Icon name="external" />
                        </List.Content>
                      )}
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              <List>
                <List.Item>
                  <List.Content>
                    {eitem.metadata.open_access && (
                      <>
                        <Label color="green" size="tiny">
                          <Icon name="lock open" /> open access
                        </Label>
                      </>
                    )}
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={2} textAlign="right">
              <Item.Meta className={'pid-field'}>
                <Header disabled as="h5" className={'pid-field'}>
                  #{eitem.metadata.pid}
                </Header>
              </Item.Meta>
              <Link
                to={BackOfficeRoutes.documentDetailsFor(
                  eitem.metadata.document_pid
                )}
              >
                Document <DocumentIcon />
              </Link>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

export default class EItemList extends Component {
  renderListEntry = eitem => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(document);
    }
    return <EItemListEntry key={eitem.metadata.pid} eitem={eitem} />;
  };

  render() {
    const { hits } = this.props;

    if (!hits.length) return <SearchEmptyResults data-test="no-results" />;

    return (
      <Item.Group divided className={'bo-eitem-search'}>
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

EItemList.propTypes = {
  hits: PropTypes.array.isRequired,
  renderListEntryElement: PropTypes.func,
};
