import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Segment, Grid } from 'semantic-ui-react';
import { BackOfficeURLS } from '../../../../common/urls';
import './Header.scss';

class Header extends Component {
  goTo = path => {
    this.props.history.push(path);
  };

  render() {
    const activePath = this.props.location.pathname;
    const itemsActive =
      activePath && activePath.indexOf(BackOfficeURLS.itemsSearch) > -1;
    const loansActive =
      activePath && activePath.indexOf(BackOfficeURLS.loansSearch) > -1;
    const locationsActive =
      activePath && activePath.indexOf(BackOfficeURLS.locationList) > -1;
    const documentsActive =
      activePath && activePath.indexOf(BackOfficeURLS.documentsSearch) > -1;
    return (
      <Segment inverted vertical className="header">
        <Grid verticalAlign="middle">
          <Grid columns={2}>
            <Grid.Column width={4} textAlign="center">
              <h1
                className="logo"
                onClick={() => this.goTo(BackOfficeURLS.home)}
              >
                Invenio APP ILS
              </h1>
            </Grid.Column>
            <Grid.Column width={12}>
              <Menu inverted pointing secondary size="large">
                <Menu.Item
                  location={BackOfficeURLS.documentsSearch}
                  active={documentsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Documents
                </Menu.Item>
                <Menu.Item
                  location={BackOfficeURLS.itemsSearch}
                  active={itemsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Items
                </Menu.Item>

                <Menu.Item
                  location={BackOfficeURLS.loansSearch}
                  active={loansActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Loans
                </Menu.Item>
                <Menu.Item
                  location={BackOfficeURLS.locationList}
                  active={locationsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Locations
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
