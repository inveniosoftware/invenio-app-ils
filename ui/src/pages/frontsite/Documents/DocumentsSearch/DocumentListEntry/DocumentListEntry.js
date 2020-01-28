import React, { Component } from 'react';
import { Grid, Item, List, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FrontSiteRoutes } from '@routes/urls';
import { getCover } from '../../../config';
import Truncate from 'react-truncate';
import { DocumentTags } from '@components/Document/DocumentTags';
import isEmpty from 'lodash/isEmpty';
import { DocumentLanguages } from '@components/Document';
import { DocumentAuthors } from '@components/Document';

export default class DocumentListEntry extends Component {
  constructor(props) {
    super(props);
    this.metadata = props.metadata;
  }

  renderCirculationInfo = meta => {
    if (
      meta.circulation &&
      (meta.circulation.has_items_for_loan > 0 || meta.eitems.total > 0)
    ) {
      return (
        <List className={'document-availability-wrapper'}>
          {meta.circulation.has_items_for_loan > 0 ? (
            <List.Item>
              <List.Icon color={'green'} name={'check'} />
              <List.Content>Available for loan</List.Content>
            </List.Item>
          ) : null}
          {meta.eitems.total > 0 ? (
            <List.Item>
              <List.Icon name="desktop" />
              <List.Content>Electronic version</List.Content>
            </List.Item>
          ) : null}
        </List>
      );
    }
    return null;
  };

  renderImprintInfo = () => {
    if (!isEmpty(this.metadata.imprint)) {
      return (
        <Grid.Column width={4}>
          <List>
            <List.Item>
              <List.Content>
                <span>Published by </span>
                {this.metadata.imprint.publisher}
              </List.Content>
            </List.Item>
            <List.Item>
              {this.metadata.imprint.place}, {this.metadata.imprint.date}
            </List.Item>
          </List>
        </Grid.Column>
      );
    }
    return null;
  };

  renderImage = () => {
    const { volume } = this.props;
    const image = (
      <Item.Image
        src={getCover(this.metadata.edition)}
        size="small"
        floated="left"
        as={Link}
        to={FrontSiteRoutes.documentDetailsFor(this.metadata.pid)}
      />
    );

    if (volume) {
      return (
        <div className="search-result-image">
          <Label floating color="black">
            Volume {volume}
          </Label>
          {image}
        </div>
      );
    }

    return image;
  };

  render() {
    return (
      <Item>
        {this.renderImage()}
        <Item.Content>
          <Item.Meta>{this.metadata.document_type}</Item.Meta>
          <Item.Header
            as={Link}
            to={FrontSiteRoutes.documentDetailsFor(this.metadata.pid)}
          >
            {this.metadata.title}
          </Item.Header>
          <Item.Meta>
            <DocumentAuthors metadata={this.metadata} prefix={'by '} />
          </Item.Meta>
          <Item.Description>
            <Truncate lines={3}>{this.metadata.abstract}</Truncate>
          </Item.Description>
          <Item.Meta>
            <Grid>
              <Grid.Column width={4}>
                {this.renderCirculationInfo(this.metadata)}
              </Grid.Column>
              {this.renderImprintInfo()}
              <Grid.Column width={4}>
                <List>
                  <List.Item>
                    <List.Content>
                      <span>Edition: </span>
                      {this.metadata.edition}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <span>Languages: </span>
                      <DocumentLanguages metadata={this.metadata} />
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid>
          </Item.Meta>
          <Item.Extra>
            <DocumentTags metadata={this.metadata} />
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

DocumentListEntry.propTypes = {
  metadata: PropTypes.object.isRequired,
  volume: PropTypes.string,
};
