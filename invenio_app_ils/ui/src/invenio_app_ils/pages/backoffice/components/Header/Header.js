import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Segment, Grid } from 'semantic-ui-react';
import { BackOfficeRoutes } from '../../../../routes/urls';
import './Header.scss';

class Header extends Component {
  goTo = path => {
    this.props.history.push(path);
  };

  render() {
    const activePath = this.props.location.pathname || '';
    const itemsActive = activePath.indexOf(BackOfficeRoutes.itemsList) > -1;
    const loansActive = activePath.indexOf(BackOfficeRoutes.loansList) > -1;
    const locationsActive =
      activePath.indexOf(BackOfficeRoutes.locationsList) > -1;
    const documentsActive =
      activePath.indexOf(BackOfficeRoutes.documentsList) > -1;
    const patronsActive = activePath.indexOf(BackOfficeRoutes.patronsList) > -1;
    return (
      <Segment inverted vertical className="header">
        <Grid verticalAlign="middle">
          <Grid columns={2}>
            <Grid.Column width={4} textAlign="center">
              <h1
                className="logo"
                onClick={() => this.goTo(BackOfficeRoutes.home)}
              >
                Invenio APP ILS
              </h1>
            </Grid.Column>
            <Grid.Column width={12}>
              <Menu inverted pointing secondary size="large">
                <Menu.Item
                  location={BackOfficeRoutes.documentsList}
                  active={documentsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Documents
                </Menu.Item>
                <Menu.Item
                  location={BackOfficeRoutes.itemsList}
                  active={itemsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Items
                </Menu.Item>

                <Menu.Item
                  location={BackOfficeRoutes.loansList}
                  active={loansActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Loans
                </Menu.Item>
                <Menu.Item
                  location={BackOfficeRoutes.locationsList}
                  active={locationsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Locations
                </Menu.Item>
                <Menu.Item
                  location={BackOfficeRoutes.patronsList}
                  active={patronsActive}
                  onClick={(e, { location }) => this.goTo(location)}
                >
                  Patrons
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
