import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Header, Icon, Menu, Divider } from 'semantic-ui-react';
import {BackOfficeRoutes, FrontSiteRoutes} from '@routes/urls';
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
      <>
        <Header as="h3" className="bo-menu-header">
          <Icon name="user circle" color="grey" />
          <Header.Content>
            John Doe
            <Header.Subheader>Librarian</Header.Subheader>
          </Header.Content>
        </Header>
        <Divider />
        <Menu text vertical className="bo-menu">
          <Menu.Item>
            <Menu.Header>Library</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                as={Link}
                active={overviewActive}
                to={BackOfficeRoutes.home}
              >
                Overview
              </Menu.Item>
              <Menu.Item
                as={Link}
                active={loansActive}
                to={BackOfficeRoutes.loansList}
              >
                Loans
              </Menu.Item>
              <Menu.Item
                as={Link}
                active={documentRequestsActive}
                to={BackOfficeRoutes.documentRequestsList}
              >
                New Book Requests
              </Menu.Item>
              <Menu.Item
                as={Link}
                active={locationsActive}
                to={BackOfficeRoutes.locationsList}
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
                active={documentsActive}
                to={BackOfficeRoutes.documentsList}
              >
                Books / Articles
              </Menu.Item>
              <Menu.Item
                as={Link}
                active={seriesActive}
                to={BackOfficeRoutes.seriesList}
              >
                Series / Monographs
              </Menu.Item>
              <Menu.Item
                as={Link}
                active={itemsActive}
                to={BackOfficeRoutes.itemsList}
              >
                Physical Copies
              </Menu.Item>
              <Menu.Item
                as={Link}
                active={eitemsActive}
                to={BackOfficeRoutes.eitemsList}
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
                active={patronsActive}
                to={BackOfficeRoutes.patronsList}
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
                active={statsActive}
                to={BackOfficeRoutes.stats.home}
              >
                Most Loaned
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
        <Divider />
        <Menu text vertical className="bo-menu">
          <Menu.Item
            as={Link}
            to={FrontSiteRoutes.home}
          >
            Go to Home Page
          </Menu.Item>
        </Menu>
      </>
    );
  }
}

export default withRouter(Sidebar);
