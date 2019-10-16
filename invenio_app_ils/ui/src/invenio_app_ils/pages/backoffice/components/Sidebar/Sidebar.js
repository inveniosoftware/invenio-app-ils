import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Menu } from 'semantic-ui-react';
import { BackOfficeRoutes } from '../../../../routes/urls';
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
              as={Link}
              to={BackOfficeRoutes.home}
              active={overviewActive}
            >
              Overview
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.loansList}
              active={loansActive}
            >
              Loans
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.documentRequestsList}
              active={documentRequestsActive}
            >
              New Book Requests
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.locationsList}
              active={locationsActive}
            >
              Locations
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Catalogue</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.documentsList}
              active={documentsActive}
            >
              Books / Articles etc.
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.seriesList}
              active={seriesActive}
            >
              Series / Monographs
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.itemsList}
              active={itemsActive}
            >
              Physical Copies
            </Menu.Item>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.eitemsList}
              active={eitemsActive}
            >
              Electronic Items
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Patrons</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.patronsList}
              active={patronsActive}
            >
              Patrons
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Statistics</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              as={Link}
              to={BackOfficeRoutes.stats.home}
              active={statsActive}
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
