import { LiteratureRelations } from '@pages/frontsite/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import { Identifiers } from '../Identifiers';
import { Notes } from '../Notes';
import { SeriesAllTitles, SeriesInfo, SeriesLinks } from './';

export class SeriesMetadataTabs extends Component {
  renderTabPanes = () => {
    const { metadata } = this.props;
    const panes = [
      {
        menuItem: 'Details',
        render: () => (
          <Tab.Pane attached={false}>
            <LiteratureRelations relations={metadata.relations} />
            <SeriesInfo />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Identifiers',
        render: () => (
          <Tab.Pane attached={false}>
            <Identifiers identifiers={metadata.identifiers} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Titles',
        render: () => (
          <Tab.Pane attached={false}>
            <SeriesAllTitles />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Notes',
        render: () => (
          <Tab.Pane attached={false}>
            <Notes content={metadata.note} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Links',
        render: () => (
          <Tab.Pane attached={false}>
            <SeriesLinks />
          </Tab.Pane>
        ),
      },
    ];

    return panes;
  };

  render() {
    return (
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={this.renderTabPanes()}
        id="series-metadata-tabs"
      />
    );
  }
}

SeriesMetadataTabs.propTypes = {
  activeTab: PropTypes.number,
  metadata: PropTypes.object.isRequired,
};
