import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Menu } from 'semantic-ui-react';
import { BackOfficeRoutes } from '../../../../routes/urls';
import { goToHandler } from '../../../../history';
import has from 'lodash/has';

class Sidebar extends Component {
  removeTrailingSlashes = path => path.replace(/\/+$/, '');
  render() {
    const activePath = has(this.props, 'location.pathname')
      ? this.removeTrailingSlashes(this.props.location.pathname)
      : '';

    const overviewActive = activePath === BackOfficeRoutes.home;
    const itemsActive = activePath === BackOfficeRoutes.itemsList;
    const eitemsActive = activePath === BackOfficeRoutes.eitemsList;
    const loansActive = activePath === BackOfficeRoutes.loansList;
    const locationsActive = activePath === BackOfficeRoutes.locationsList;
    const documentsActive = activePath === BackOfficeRoutes.documentsList;
    const documentRequestsActive =
      activePath === BackOfficeRoutes.documentRequestsList;
    const patronsActive = activePath === BackOfficeRoutes.patronsList;
    const seriesActive = activePath === BackOfficeRoutes.seriesList;
    const statsActive = activePath === BackOfficeRoutes.stats.home;
    return (
      <Menu text vertical>
        <Menu.Item>
          <Menu.Header>Library</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={overviewActive}
              onClick={goToHandler(BackOfficeRoutes.home)}
            >
              Overview
            </Menu.Item>
            <Menu.Item
              active={loansActive}
              onClick={goToHandler(BackOfficeRoutes.loansList)}
            >
              Loans
            </Menu.Item>
            <Menu.Item
              active={documentRequestsActive}
              onClick={goToHandler(BackOfficeRoutes.documentRequestsList)}
            >
              Document Requests
            </Menu.Item>
            <Menu.Item
              active={locationsActive}
              onClick={goToHandler(BackOfficeRoutes.locationsList)}
            >
              Locations
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Catalogue</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={documentsActive}
              onClick={goToHandler(BackOfficeRoutes.documentsList)}
            >
              Books / Articles etc.
            </Menu.Item>
            <Menu.Item
              active={seriesActive}
              onClick={goToHandler(BackOfficeRoutes.seriesList)}
            >
              Series / Monographs
            </Menu.Item>
            <Menu.Item
              active={itemsActive}
              onClick={goToHandler(BackOfficeRoutes.itemsList)}
            >
              Physical Items
            </Menu.Item>
            <Menu.Item
              active={eitemsActive}
              onClick={goToHandler(BackOfficeRoutes.eitemsList)}
            >
              Electronic Items
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Patrons</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={patronsActive}
              onClick={goToHandler(BackOfficeRoutes.patronsList)}
            >
              All Users
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Statistics</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              active={statsActive}
              onClick={goToHandler(BackOfficeRoutes.stats.home)}
            >
              Most Loaned
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Sidebar);
