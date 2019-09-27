import React, { Component } from 'react';
import {
  Button,
  Item,
  Label,
  Segment,
  Responsive,
  Icon,
  Divider,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class DocumentItem extends Component {
  constructor(props) {
    super(props);
    this.metadata = props.metadata;
  }

  renderBookAvailabilityLabel = circulationData => {
    return (
      <Label
        color={circulationData.has_items_for_loan ? 'green' : 'red'}
        content="Copies on shelf"
        detail={circulationData.has_items_for_loan}
      />
    );
  };

  renderPastLoansLabel = circulationData => {
    return (
      <Label
        color="blue"
        content="Past loans"
        detail={circulationData.past_loans_count}
      />
    );
  };

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    return (
      <Segment>
        <Divider hidden />
        <Item.Group divided>
          <Item>
            <Item.Image src={cover} size="small" floated="left" />
            <Responsive {...Responsive.onlyMobile}>
              <div className="document-share-buttons"></div>
            </Responsive>
            <Item.Content>
              <Item.Header>{this.metadata.title.title}</Item.Header>
              <Item.Meta>
                <span className="author">
                  Authors:{' '}
                  {this.metadata.authors
                    .map(author => author.full_name)
                    .join(',')}
                </span>
              </Item.Meta>
              <Item.Meta>
                <span className="edition">
                  Publisher: {this.metadata.publishers}
                </span>
              </Item.Meta>
              <Responsive {...Responsive.onlyMobile}>
                <Item.Description>
                  {this.metadata.abstracts[0].value}
                </Item.Description>
              </Responsive>
              <Responsive {...Responsive.onlyComputer}>
                <Item.Description>
                  {this.metadata.abstracts[0].value}
                </Item.Description>
              </Responsive>
              <Item.Extra>
                <Button
                  primary
                  onClick={() => {
                    this.props.rowActionClickHandler(this.metadata.pid);
                  }}
                >
                  <Icon name="eye" />
                  View Details
                </Button>
                <Divider hidden />
                {this.renderBookAvailabilityLabel(this.metadata.circulation)}
                <Divider hidden />
                {this.renderPastLoansLabel(this.metadata.circulation)}
              </Item.Extra>
              <Item.Extra>
                <Label>Non-Fiction</Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
        <Responsive {...Responsive.onlyComputer}>
          <div className="document-share-buttons"></div>
        </Responsive>
      </Segment>
    );
  }
}

DocumentItem.propTypes = {
  metadata: PropTypes.object.isRequired,
};
