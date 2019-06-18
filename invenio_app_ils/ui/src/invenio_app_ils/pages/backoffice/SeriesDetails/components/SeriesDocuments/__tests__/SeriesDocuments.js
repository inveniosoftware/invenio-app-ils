import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import SeriesDocuments from '../SeriesDocuments';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import history from '../../../../../../history';

jest.mock('../../../../../../common/config');

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
    series_pid: 111,
    metadata: {
      series_pid: 111,
    },
  };

  it('should load the SeriesDocuments component', () => {
    const component = shallow(
      <SeriesDocuments
        series={series}
        data={{ hits: [], total: 0 }}
        fetchSeriesDocuments={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchSeriesDocuments = jest.fn();
    component = mount(
      <SeriesDocuments
        series={series}
        data={{ hits: [], total: 0 }}
        fetchSeriesDocuments={mockedFetchSeriesDocuments}
      />
    );
    expect(mockedFetchSeriesDocuments).toHaveBeenCalledWith(series.series_pid);
  });

  it('should render show a message with no documents', () => {
    component = mount(
      <SeriesDocuments
        series={series}
        data={{ hits: [], total: 0 }}
        fetchSeriesDocuments={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
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
          document_pid: 'document1',
          metadata: {
            series_pid: 'doc1',
            document_pid: 'document1',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
            series_objs: [],
          },
        },
        {
          id: '2',
          updated: stringDate,
          created: stringDate,
          document_pid: 'document2',
          metadata: {
            series_pid: 'doc2',
            document_pid: 'document2',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
            series_objs: [],
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        series={series}
        data={data}
        fetchSeriesDocuments={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
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
            document_pid: '1',
            title: 'Test',
            series_objs: [],
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          metadata: {
            document_pid: '2',
            title: 'Test 2',
            series_objs: [],
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        series={series}
        data={data}
        fetchSeriesDocuments={() => {}}
        showMaxDocuments={1}
      />
    );

    expect(component).toMatchSnapshot();
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
          document_pid: 'document1',
          metadata: {
            document_pid: 'document1',
            title: 'Title',
            series_objs: [],
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <SeriesDocuments
        series={series}
        data={data}
        fetchSeriesDocuments={() => {}}
        showMaxItems={1}
      />
    );

    const firstId = data.hits[0].document_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.documentDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
