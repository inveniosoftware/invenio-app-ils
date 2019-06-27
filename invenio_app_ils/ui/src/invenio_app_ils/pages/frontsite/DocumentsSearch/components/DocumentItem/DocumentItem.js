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
import { EitemsButton, ShareButtons } from '../../../components';
import config from '../../../../frontsite/DocumentsSearch/config';

export default class DocumentItem extends Component {
  constructor(props) {
    super(props);
    this.metadata = props.metadata;
  }

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    return (
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={cover} size="small" floated="left" />
            <Responsive {...Responsive.onlyMobile}>
              <div className="document-share-buttons">
                <ShareButtons type="mobile" />
              </div>
            </Responsive>
            <Item.Content>
              <Item.Header>{this.metadata.title}</Item.Header>
              <Item.Meta>
                <span className="author">Author: {this.metadata.authors}</span>
              </Item.Meta>
              <Item.Meta>
                <span className="edition">
                  Publisher: {this.metadata.publishers}
                </span>
              </Item.Meta>
              <Responsive {...Responsive.onlyMobile}>
                <Item.Description>
                  {truncate(this.metadata.abstracts, {
                    length: config.MAX_TEXT_LENGTH,
                  })}
                </Item.Description>
              </Responsive>
              <Responsive {...Responsive.onlyComputer}>
                <Item.Description>
                  {truncate(this.metadata.abstracts, {
                    length: config.MAX_TEXT_LENGTH,
                  })}
                </Item.Description>
              </Responsive>
              <Item.Extra>
                <EitemsButton eitems={this.metadata._computed.eitems} />
                <Button
                  primary
                  onClick={() => {
                    this.props.rowActionClickHandler(
                      this.metadata.document_pid
                    );
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
          <div className="document-share-buttons">
            <ShareButtons type="mobile" />
          </div>
        </Responsive>
      </Segment>
    );
  }
}

DocumentItem.propTypes = {
  metadata: PropTypes.object.isRequired,
};
