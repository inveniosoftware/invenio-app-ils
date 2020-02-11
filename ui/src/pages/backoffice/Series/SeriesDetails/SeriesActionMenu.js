import { SeriesDeleteModal } from '@pages/backoffice/Series/SeriesDetails/components';
import PropTypes from 'prop-types';
import { EditButton } from '@pages/backoffice';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import { Divider, Menu } from 'semantic-ui-react';

export default class SeriesActionMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { activeItem: '' };
  }

  scrollTo(ref, menuItemName) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth', block: 'end' });
    this.setState({ activeItem: menuItemName });
  }

  render() {
    const { series, relations, anchors } = this.props;
    const { activeItem } = this.state;
    return (
      <div className={'bo-action-menu'}>
        <EditButton
          fluid
          to={BackOfficeRoutes.seriesEditFor(series.metadata.pid)}
          text="Edit series"
        />
        <SeriesDeleteModal relations={relations} series={series} />

        <Divider horizontal>Navigation</Divider>

        <Menu pointing secondary vertical fluid className="left">
          <Menu.Item
            name="header"
            active={activeItem === 'header'}
            onClick={(e, { name }) => this.scrollTo(anchors.top, name)}
          >
            Metadata
          </Menu.Item>
          <Menu.Item
            name="series-documents"
            active={activeItem === 'series-documents'}
            onClick={(e, { name }) => this.scrollTo(anchors.documents, name)}
          >
            Literature of this series
          </Menu.Item>
          <Menu.Item
            name="series-relations"
            active={activeItem === 'series-relations'}
            onClick={(e, { name }) => this.scrollTo(anchors.relations, name)}
          >
            Relations
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

SeriesActionMenu.propTypes = {
  anchors: PropTypes.object,
  relations: PropTypes.object.isRequired,
  series: PropTypes.object.isRequired,
};
