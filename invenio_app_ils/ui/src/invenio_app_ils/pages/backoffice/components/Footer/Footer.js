import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <Container fluid className="footer-upper">
          <Container>
            <Grid columns={3} stackable>
              <Grid.Column>
                <Header as="h4" content={'Address'} />
                <p>
                  Library
                  <br />
                  Address line 1 <br />
                  Address line 2 <br />
                  Phone: +41 00 000 000
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
              <Header.Content>Integrated Library System</Header.Content>
              <Header.Subheader>Powered by INVENIO</Header.Subheader>
            </Header>
          </Container>
        </Container>
      </footer>
    );
  }
}
