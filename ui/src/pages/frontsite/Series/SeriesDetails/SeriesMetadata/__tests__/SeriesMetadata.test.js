import React from 'react';
import { mount } from 'enzyme';
import * as testData from '@testData/series.json';
import SeriesMetadata from '../SeriesMetadata';

jest.mock('@pages/frontsite/components/Series', () => {
  return {
    SeriesMetadataAccordion: () => null,
    SeriesMetadataTabs: () => null,
  };
});

describe('SeriesMetadata tests', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const seriesDetails = {
    id: 71,
    created: '2019-07-08T10:44:02.366+02:00',
    updated: '2019-07-08T10:44:18.354+02:00',
    links: { self: 'https://127.0.0.1:5000/api/series/71' },
    metadata: {
      $schema: 'https://127.0.0.1:5000/schemas/series/series-v1.0.0.json',
      ...testData[0],
      pid: '71',
    },
  };

  it('should render the series correctly', () => {
    component = mount(<SeriesMetadata series={seriesDetails} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('SeriesMetadata')
      .find('Container')
      .filterWhere(
        element => element.prop('data-test') === seriesDetails.metadata.pid
      );
    expect(rows).toHaveLength(1);
  });
});
