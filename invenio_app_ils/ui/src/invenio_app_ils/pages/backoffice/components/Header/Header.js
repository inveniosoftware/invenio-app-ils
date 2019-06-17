import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Menu, Segment, Grid } from 'semantic-ui-react';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { goToHandler } from '../../../../history';
import has from 'lodash/has';
import './Header.scss';

class Header extends Component {
  render() {
    const activePath = has(this.props, 'location.pathname')
      ? this.props.location.pathname
      : '';
    const itemsActive = activePath.indexOf(BackOfficeRoutes.itemsList) > -1;
    const eitemsActive = activePath.indexOf(BackOfficeRoutes.eitemsList) > -1;
    const loansActive = activePath.indexOf(BackOfficeRoutes.loansList) > -1;
    const locationsActive =
      activePath.indexOf(BackOfficeRoutes.locationsList) > -1;
    const documentsActive =
      activePath.indexOf(BackOfficeRoutes.documentsList) > -1;
    const patronsActive = activePath.indexOf(BackOfficeRoutes.patronsList) > -1;
    const seriesActive = activePath.indexOf(BackOfficeRoutes.seriesList) > -1;
    return (
      <Segment inverted vertical className="header">
        <Grid verticalAlign="middle">
          <Grid columns={2}>
            <Grid.Column width={4} textAlign="center">
              <h1 className="logo" onClick={goToHandler(BackOfficeRoutes.home)}>
                Invenio APP ILS
              </h1>
            </Grid.Column>
            <Grid.Column width={12}>
              <Menu inverted pointing secondary size="large">
                <Menu.Item
                  active={documentsActive}
                  onClick={goToHandler(BackOfficeRoutes.documentsList)}
                >
                  Documents
                </Menu.Item>
                <Menu.Item
                  active={itemsActive}
                  onClick={goToHandler(BackOfficeRoutes.itemsList)}
                >
                  Items
                </Menu.Item>
                <Menu.Item
                  active={eitemsActive}
                  onClick={goToHandler(BackOfficeRoutes.eitemsList)}
                >
                  EItems
                </Menu.Item>
                <Menu.Item
                  active={loansActive}
                  onClick={goToHandler(BackOfficeRoutes.loansList)}
                >
                  Loans
                </Menu.Item>
                <Menu.Item
                  active={locationsActive}
                  onClick={goToHandler(BackOfficeRoutes.locationsList)}
                >
                  Locations
                </Menu.Item>
                <Menu.Item
                  active={patronsActive}
                  onClick={goToHandler(BackOfficeRoutes.patronsList)}
                >
                  Patrons
                </Menu.Item>
                <Menu.Item
                  active={seriesActive}
                  onClick={goToHandler(BackOfficeRoutes.seriesList)}
                >
                  Series
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
