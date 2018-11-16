import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Segment, Grid } from 'semantic-ui-react';
import { URLS } from 'common/urls';
import './Header.scss';

class Header extends Component {
  goTo = (e, { location }) => {
    this.props.history.push(location);
  };

  render() {
    const activePath = this.props.location.pathname;
    const itemsActive = activePath && activePath.indexOf(URLS.itemsSearch) > -1;
    const loansActive = activePath && activePath.indexOf(URLS.loansSearch) > -1;
    return (
      <Segment inverted vertical className="header">
        <Grid verticalAlign="middle">
          <Grid columns={2}>
            <Grid.Column width={4} textAlign="center">
              <h1
                className="logo"
                onClick={() => this.goTo(null, { location: URLS.root })}
              >
                Invenio APP ILS
              </h1>
            </Grid.Column>
            <Grid.Column width={12}>
              <Menu inverted pointing secondary size="large">
                <Menu.Item
                  location={URLS.itemsSearch}
                  active={itemsActive}
                  onClick={this.goTo}
                >
                  Items
                </Menu.Item>
                <Menu.Item
                  location={URLS.loansSearch}
                  active={loansActive}
                  onClick={this.goTo}
                >
                  Loans
                </Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid>
        </Grid>
      </Segment>
    );
  }
}

export default withRouter(Header);
