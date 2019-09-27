import React, { Component } from 'react';
import { Grid, Image, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DocumentCirculation } from '../DocumentCirculation';
import ShowMore from 'react-show-more';

export default class DocumentPanel extends Component {
  constructor(props) {
    super(props);
    this.document = props.documentsDetails;
  }

  render() {
    const cover = 'https://assets.thalia.media/img/46276899-00-00.jpg';
    return (
      <>
        <br />
        <br />
        <div className="document-panel" data-test={this.document.metadata.pid}>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Image className="document-cover" src={cover} size={'large'} />
              </Grid.Column>
              <Grid.Column>
                <Header as={'h2'}>{this.document.metadata.title}</Header>
                {this.document.metadata.subtitle ? (
                  <Header sub as={'h3'}>
                    {this.document.metadata.subtitle}
                  </Header>
                ) : null}
                by{' '}
                <List horizontal>
                  {this.document.metadata.authors.map((author, index) => (
                    <List.Item as="h4" key={`Key${index}`}>
                      {author.full_name}
                    </List.Item>
                  ))}
                </List>
                <ShowMore
                  lines={20}
                  more="Show more"
                  less="Show less"
                  anchorClass="button-show-more"
                >
                  {this.document.metadata.abstract}
                </ShowMore>
              </Grid.Column>
              <Grid.Column>
                <DocumentCirculation test />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </>
    );
  }
}

DocumentPanel.propTypes = {
  documentsDetails: PropTypes.object.isRequired,
};
