import React, { Component } from 'react';
import {
  Button,
  Item,
  Label,
  Segment,
  Responsive,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash/string';
import { EitemsButton } from '../../../components/EitemsButton';

export default class RecordItem extends Component {
  renderShareButtons() {
    return (
      <div className="document-share-buttons">
        <Button
          href="https://www.facebook.com/sharer/sharer.php"
          circular
          color="facebook"
          icon="facebook"
          size="mini"
        />
        <Button
          href="https://twitter.com/intent/tweet"
          circular
          color="twitter"
          icon="twitter"
          size="mini"
        />
        <Button circular color="linkedin" icon="linkedin" size="mini" />
      </div>
    );
  }

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    const { metadata } = this.props;
    const maxTextLength = 100;
    return (
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={cover} size="small" floated="left" />
            <Responsive {...Responsive.onlyMobile}>
              {this.renderShareButtons()}
            </Responsive>
            <Item.Content>
              <Item.Header>{metadata.title}</Item.Header>
              <Item.Meta>
                <span className="author">Author: {metadata.authors}</span>
              </Item.Meta>
              <Item.Meta>
                <span className="edition">
                  Publisher: {metadata.publishers}
                </span>
              </Item.Meta>
              <Responsive {...Responsive.onlyMobile}>
                <Item.Description>
                  {truncate(metadata.abstracts, { length: maxTextLength })}
                </Item.Description>
              </Responsive>
              <Responsive {...Responsive.onlyComputer}>
                <Item.Description>
                  {truncate(metadata.abstracts, { length: maxTextLength })}
                </Item.Description>
              </Responsive>
              <Item.Extra>
                <EitemsButton eitems={metadata._computed.eitems} />
                <Button
                  primary
                  onClick={() => {
                    this.props.rowActionClickHandler(metadata.document_pid);
                  }}
                >
                  <Icon name="eye" />
                  View Details
                </Button>
              </Item.Extra>
              <Item.Extra>
                <Label>Non-Fiction</Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
        <Responsive {...Responsive.onlyComputer}>
          {this.renderShareButtons()}
        </Responsive>
      </Segment>
    );
  }
}

RecordItem.propTypes = {
  metadata: PropTypes.object.isRequired,
};
