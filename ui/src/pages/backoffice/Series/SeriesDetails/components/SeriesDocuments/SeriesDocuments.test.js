import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '@routes/urls';
import SeriesDocuments from './SeriesDocuments';
import { Settings } from 'luxon';
import { fromISO } from '@api/date';
import * as testData from '@testData/documents';
import * as testSeries from '@testData/series';

jest.mock('react-router-dom');
Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');
BackOfficeRoutes.documentDetailsFor = jest.fn(pid => `url/${pid}`);
let mockViewDetails = jest.fn();

jest.mock('@pages/backoffice', () => {
  return {
    InfoMessage: () => null,
  };
});

describe('SeriesDocuments tests', () => {
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

  it('should load the SeriesDocuments component', () => {
    const component = shallow(
      <SeriesDocuments
        seriesDetails={{ metadata: testSeries[0] }}
        seriesDocuments={{ hits: [], total: 0 }}
        fetchSeriesDocuments={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchSeriesDocuments = jest.fn();
    component = mount(
      <SeriesDocuments
        seriesDetails={{ metadata: testSeries[0] }}
        seriesDocuments={{ hits: [], total: 0 }}
        fetchSeriesDocuments={mockedFetchSeriesDocuments}
      />
    );
    expect(mockedFetchSeriesDocuments).toHaveBeenCalledWith(
      testSeries[0].pid,
      testSeries[0].mode_of_issuance
    );
  });

  it('should render show a message with no documents', () => {
    component = mount(
      <SeriesDocuments
        seriesDetails={{ metadata: testSeries[0] }}
        seriesDocuments={{ hits: [], total: 0 }}
        fetchSeriesDocuments={() => {}}
      />
    );

    const message = component
      .find('InfoMessage')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render document', () => {
    const data = {
      hits: [
        {
          ID: '1',
          created: stringDate,
          pid: 'document1',
          metadata: {
            ...testData[0],
            pid: 'document1',
            volume: '1',
          },
        },
        {
          id: '2',
          updated: stringDate,
          created: stringDate,
          pid: 'document2',
          metadata: {
            ...testData[1],
            pid: 'document2',
            volume: '2',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        seriesDetails={{ metadata: testSeries[0] }}
        seriesDocuments={data}
        fetchSeriesDocuments={() => {}}
      />
    );

    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'document1' ||
          element.prop('data-test') === 'document2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few documents', () => {
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          metadata: {
            ...testData[0],
            pid: '1',
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          metadata: {
            ...testData[1],
            pid: '2',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        seriesDetails={{ metadata: testSeries[0] }}
        seriesDocuments={data}
        fetchSeriesDocuments={() => {}}
        showMaxDocuments={1}
      />
    );

    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });
});
