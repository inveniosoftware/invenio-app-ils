import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '@routes/urls';
import { SeriesMultipartMonographsData as SeriesMultipartMonographs } from '../SeriesMultipartMonographs';
import { Settings } from 'luxon';
import { fromISO } from '@api/date';
import { Button } from 'semantic-ui-react';

jest.mock('react-router-dom');
BackOfficeRoutes.seriesDetailsFor = jest.fn(pid => `url/${pid}`);
let mockViewDetails = jest.fn();

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('SeriesMultipartMonographs tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    if (component) {
      component.unmount();
    }
  });

  const series = {
    pid: 111,
    metadata: {
      pid: 111,
      mode_of_issuance: 'SERIAL',
      relations: {},
    },
  };

  it('should load the SeriesMultipartMonographs component', () => {
    const component = shallow(
      <SeriesMultipartMonographs
        seriesDetails={series}
        multipartMonographs={{ hits: [], total: 0 }}
        fetchSeriesMultipartMonographs={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchSeriesMultipartMonographs = jest.fn();
    component = mount(
      <SeriesMultipartMonographs
        seriesDetails={series}
        multipartMonographs={{ hits: [], total: 0 }}
        fetchSeriesMultipartMonographs={mockedFetchSeriesMultipartMonographs}
      />
    );
    expect(mockedFetchSeriesMultipartMonographs).toHaveBeenCalledWith(
      series.pid
    );
  });

  it('should render show a message with no series', () => {
    component = mount(
      <SeriesMultipartMonographs
        seriesDetails={series}
        multipartMonographs={{ hits: [], total: 0 }}
        fetchSeriesMultipartMonographs={() => {}}
      />
    );

    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render series', () => {
    const data = {
      hits: [
        {
          ID: '1',
          updated: stringDate,
          created: stringDate,
          pid: 'series1',
          metadata: {
            pid: 'series1',
            title: 'Test',
            mode_of_issuance: 'MULTIPART_MONOGRAPH',
            relations: {},
          },
        },
        {
          id: '2',
          updated: stringDate,
          created: stringDate,
          pid: 'series2',
          metadata: {
            pid: 'series2',
            title: 'Test',
            mode_of_issuance: 'MULTIPART_MONOGRAPH',
            relations: {},
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesMultipartMonographs
        seriesDetails={series}
        multipartMonographs={data}
        fetchSeriesMultipartMonographs={() => {}}
      />
    );

    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'series1' ||
          element.prop('data-test') === 'series2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few series', () => {
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          metadata: {
            pid: '1',
            relations: {},
            title: 'Test',
            mode_of_issuance: 'MULTIPART_MONOGRAPH',
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          metadata: {
            pid: '2',
            relations: {},
            title: 'Test 2',
            mode_of_issuance: 'MULTIPART_MONOGRAPH',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesMultipartMonographs
        seriesDetails={series}
        multipartMonographs={data}
        fetchSeriesMultipartMonographs={() => {}}
        showMaxSeries={1}
      />
    );

    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to series details when clicking on a series row', () => {
    const data = {
      hits: [
        {
          ID: '1',
          updated: stringDate,
          created: stringDate,
          pid: 'series1',
          metadata: {
            pid: 'series1',
            title: 'Title',
            mode_of_issuance: 'MULTIPART_MONOGRAPH',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesMultipartMonographs
        seriesDetails={series}
        multipartMonographs={data}
        fetchSeriesMultipartMonographs={() => {}}
        showMaxItems={1}
      />
    );

    component.instance().viewDetails = jest.fn(() => (
      <Button onClick={mockViewDetails}></Button>
    ));
    component.instance().forceUpdate();

    const firstId = data.hits[0].pid;
    component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('Button')
      .simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
