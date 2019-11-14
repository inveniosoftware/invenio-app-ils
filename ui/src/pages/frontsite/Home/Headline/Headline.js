import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Divider, Grid, Header } from 'semantic-ui-react';
import { HomeSearchBar } from '../HomeSearchBar';
import { FrontSiteRoutes } from '@routes/urls';
import { Link } from 'react-router-dom';

export default class Headline extends Component {
  render() {
    if (this.props.renderElement) {
      return this.props.renderElement(this.props);
    }
    return (
      <Container
        fluid
        className="fs-headline-section"
        style={{
          backgroundImage: this.props.headlineImage
            ? `url(${this.props.headlineImage})`
            : null,
        }}
      >
        <Container fluid className={'fs-headline'}>
          <Container className={'container-header'}>
            <Grid>
              <Grid.Column width={16} textAlign={'left'}>
                <Header as="h1" className={'fs-headline-header'} size="huge">
                  Integrated Library System
                </Header>
                <Header.Subheader className={'fs-headline-subheader'}>
                  Find books fast and easily.
                </Header.Subheader>
              </Grid.Column>
            </Grid>
          </Container>
          <Container className={'container-search'}>
            <HomeSearchBar />
          </Container>
          <Container className={'container-extra'}>
            <Divider />
            <Grid>
              <Grid.Column width={16} textAlign={'center'}>
                <Button
                  className={'headline-quick-access'}
                  as={Link}
                  to={FrontSiteRoutes.documentsListWithQuery(
                    '&sort=mostrecent&order=desc'
                  )}
                  primary
                >
                  Recent books
                </Button>
                <Button
                  className={'headline-quick-access'}
                  as={Link}
                  to={FrontSiteRoutes.documentsListWithQuery(
                    '&sort=mostloaned&order=desc'
                  )}
                  primary
                >
                  Most loaned books
                </Button>
                <Button
                  className={'headline-quick-access'}
                  as={Link}
                  to={FrontSiteRoutes.documentsListWithQuery(
                    '&f=doctype%3ABOOK&f=medium%3AELECTRONIC_VERSION&sort=mostrecent&order=desc'
                  )}
                  primary
                >
                  New e-books
                </Button>
              </Grid.Column>
            </Grid>
          </Container>
        </Container>
      </Container>
    );
  }
}

Headline.propTypes = {
  renderElement: PropTypes.func,
};
