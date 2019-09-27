import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import SeriesDocuments from '../SeriesDocuments';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../../common/api/date';
import history from '../../../../../../../history';
import * as testData from '../../../../../../../../../../../tests/data/documents';

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('SeriesDocuments tests', () => {
  let component;
  afterEach(() => {
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
        seriesDetails={series}
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
        seriesDetails={series}
        seriesDocuments={{ hits: [], total: 0 }}
        fetchSeriesDocuments={mockedFetchSeriesDocuments}
      />
    );
    expect(mockedFetchSeriesDocuments).toHaveBeenCalledWith(
      series.pid,
      'SERIAL'
    );
  });

  it('should render show a message with no documents', () => {
    component = mount(
      <SeriesDocuments
        seriesDetails={series}
        seriesDocuments={{ hits: [], total: 0 }}
        fetchSeriesDocuments={() => {}}
      />
    );

    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render document', () => {
    const data = {
      hits: [
        {
          ID: '1',
          updated: stringDate,
          created: stringDate,
          pid: 'document1',
          metadata: {
            ...testData[0],
            pid: 'document1',
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
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        seriesDetails={series}
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
        seriesDetails={series}
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

  it('should go to documents details when clicking on a document row', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          ID: '1',
          updated: stringDate,
          created: stringDate,
          pid: 'document1',
          metadata: {
            ...testData[0],
            pid: 'document1',
            series_objs: [],
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        seriesDetails={series}
        seriesDocuments={data}
        fetchSeriesDocuments={() => {}}
        showMaxItems={1}
      />
    );

    const firstId = data.hits[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.documentDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
