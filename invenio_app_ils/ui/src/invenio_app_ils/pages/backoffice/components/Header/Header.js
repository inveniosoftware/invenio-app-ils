import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Menu, Segment, Grid } from 'semantic-ui-react';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { goToHandler } from '../../../../history';
import has from 'lodash/has';
import './Header.scss';

class Header extends Component {
  removeTrailingSlashes = path => path.replace(/\/+$/, '');
  render() {
    const activePath = has(this.props, 'location.pathname')
      ? this.removeTrailingSlashes(this.props.location.pathname)
      : '';

    const itemsActive = activePath == BackOfficeRoutes.itemsList;
    const eitemsActive = activePath == BackOfficeRoutes.eitemsList;
    const loansActive = activePath == BackOfficeRoutes.loansList;
    const locationsActive = activePath == BackOfficeRoutes.locationsList;
    const documentsActive = activePath == BackOfficeRoutes.documentsList;
    const documentRequestsActive =
      activePath == BackOfficeRoutes.documentRequestsList;
    const patronsActive = activePath == BackOfficeRoutes.patronsList;
    const seriesActive = activePath == BackOfficeRoutes.seriesList;
    const statsActive = activePath == BackOfficeRoutes.stats.home;
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
                <Menu.Item
                  active={documentRequestsActive}
                  onClick={goToHandler(BackOfficeRoutes.documentRequestsList)}
                >
                  Document Requests
                </Menu.Item>
                <Menu.Item
                  active={statsActive}
                  onClick={goToHandler(BackOfficeRoutes.stats.home)}
                >
                  Statistics
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
