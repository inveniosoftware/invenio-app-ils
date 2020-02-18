import { SeriesDeleteModal } from '@pages/backoffice/Series/SeriesDetails/components';
import PropTypes from 'prop-types';
import { EditButton } from '@pages/backoffice';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Divider, Menu } from 'semantic-ui-react';

export default class SeriesActionMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { activeItem: '' };
  }

  render() {
    const { series, relations } = this.props;
    const { activeItem } = this.state;
    const offset = -180;
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
            activeClass="active"
            as={ScrollLink}
            to={'metadata'}
            spy={true}
            onSetActive={() => this.setState({ activeItem: 'metadata' })}
            offset={offset}
          >
            Metadata
          </Menu.Item>
          <Menu.Item
            name="series-documents"
            active={activeItem === 'series-documents'}
            activeClass="active"
            as={ScrollLink}
            to={'series-documents'}
            spy={true}
            onSetActive={() =>
              this.setState({ activeItem: 'series-documents' })
            }
            offset={offset}
          >
            Literature of this series
          </Menu.Item>
          {series.metadata.mode_of_issuance === 'MULTIPART_MONOGRAPH' && (
            <Menu.Item
              name="series-serials"
              active={activeItem === 'series-serials'}
              activeClass="active"
              as={ScrollLink}
              to={'series-serials'}
              spy={true}
              onSetActive={() =>
                this.setState({ activeItem: 'series-serials' })
              }
              offset={offset}
            >
              Serials
            </Menu.Item>
          )}
          {series.metadata.mode_of_issuance === 'SERIAL' && (
            <Menu.Item
              name="series-monographs"
              active={activeItem === 'series-monographs'}
              activeClass="active"
              as={ScrollLink}
              to={'series-monographs'}
              spy={true}
              onSetActive={() =>
                this.setState({ activeItem: 'series-monographs' })
              }
              offset={offset}
            >
              Multipart monograph
            </Menu.Item>
          )}
          <Menu.Item
            name="series-relations"
            active={activeItem === 'series-relations'}
            activeClass="active"
            as={ScrollLink}
            to={'series-relations'}
            spy={true}
            onSetActive={() =>
              this.setState({ activeItem: 'series-relations' })
            }
            offset={offset}
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
