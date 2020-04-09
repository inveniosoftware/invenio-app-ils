import { getStaticPageByName } from '@config/uiConfig';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, List } from 'semantic-ui-react';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        {this.props.renderElement ? (
          this.props.renderElement()
        ) : (
          <>
            <Container fluid className="footer-upper">
              <Container>
                <Grid columns={2} stackable>
                  <Grid.Column>
                    <Header as="h4" content={'More information'} />
                    <List>
                      <List.Item>
                        <Link to={getStaticPageByName('about').route}>
                          About
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link to={getStaticPageByName('contact').route}>
                          Contact
                        </Link>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as="h4" content={'Invenio'} />
                    <p>
                      Read more about us on: <br />
                      <a
                        href="https://inveniosoftware.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://inveniosoftware.org/
                      </a>
                    </p>
                  </Grid.Column>
                </Grid>
              </Container>
            </Container>
            <Container fluid className="footer-lower">
              <Container>
                <Header as="h4" textAlign={'center'}>
                  <Header.Content>Integrated Library System</Header.Content>
                  <Header.Subheader>Powered by INVENIO</Header.Subheader>
                </Header>
              </Container>
            </Container>
          </>
        )}
      </footer>
    );
  }
}

Footer.propTypes = {
  renderElement: PropTypes.func,
};
