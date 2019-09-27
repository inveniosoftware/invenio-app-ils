import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';

export default class Footer extends Component {
  render() {
    return (
      <footer className="frontsite-footer">
        <Container fluid className="footer-upper">
          <Container>
            <Grid columns={3}>
              <Grid.Column>
                <Header as="h4" content={'Address'} />
                <p>
                  CERN Library <br />
                  Building 52-1-052 <br />
                  CERN Meyrin Site <br />
                  Phone: +41 22 767 2444
                </p>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4" content={'Opening hours'} />
                <p>
                  Open 24 hours a day, every day of the year <br />
                  Staffed from 8.30 to 19.00, Monday-Friday
                </p>
              </Grid.Column>
            </Grid>
          </Container>
        </Container>
        <Container fluid className="footer-lower">
          <Container>
            <Header as="h4" textAlign={'center'}>
              <Header.Content>CERN Internal Library System</Header.Content>
              <Header.Subheader>Powered by INVENIO</Header.Subheader>
            </Header>
          </Container>
        </Container>
      </footer>
    );
  }
}
