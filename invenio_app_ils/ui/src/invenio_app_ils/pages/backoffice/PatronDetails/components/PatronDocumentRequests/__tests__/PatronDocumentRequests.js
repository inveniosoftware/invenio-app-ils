import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import PatronDocumentRequests from '../PatronDocumentRequests';
import history from '../../../../../../history';

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('PatronDocumentRequests tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const patron = {
    pid: '2',
  };

  it('should load the details component', () => {
    const mockedFetchPatronDocumentRequests = jest.fn();

    const component = shallow(
      <PatronDocumentRequests
        data={{ hits: [], total: 0 }}
        patronPid={patron.pid}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user document requests', () => {
    const mockedFetchPatronDocumentRequests = jest.fn();
    component = mount(
      <PatronDocumentRequests
        patronPid={patron.pid}
        data={{ hits: [], total: 0 }}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render patron document requests', () => {
    const mockedFetchPatronDocumentRequests = jest.fn();
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          pid: 'documentRequest1',
          metadata: {
            pid: 'documentRequest1',
            patron_pid: 'patron_1',
            state: 'PENDING',
            title: 'Test',
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          pid: 'documentRequest2',
          metadata: {
            pid: 'documentRequest2',
            patron_pid: 'patron_2',
            state: 'PENDING',
            title: 'Test',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <PatronDocumentRequests
        patronPid={patron.pid}
        data={data}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
      />
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'documentRequest1' ||
          element.prop('data-test') === 'documentRequest2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few patron document requests', () => {
    const mockedFetchPatronDocumentRequests = jest.fn();
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          pid: 'documentRequest1',
          metadata: {
            pid: 'documentRequest1',
            patron_pid: 'patron_1',
            state: 'PENDING',
            title: 'Test',
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          pid: 'documentRequest2',
          metadata: {
            pid: 'documentRequest2',
            patron_pid: 'patron_2',
            state: 'PENDING',
            title: 'Test',
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <PatronDocumentRequests
        patronPid={patron.pid}
        data={data}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
        showMaxDocumentRequests={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to document request details when clicking on a patron document request', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          pid: 'documentRequest1',
          metadata: {
            pid: 'documentRequest1',
            patron_pid: 'patron_1',
            state: 'PENDING',
            title: 'Test',
          },
        },
      ],
      total: 1,
    };

    const mockedFetchPatronDocumentRequests = jest.fn();
    component = mount(
      <PatronDocumentRequests
        patronPid={patron.pid}
        data={data}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
        showMaxDocumentRequests={1}
      />
    );

    const firstId = data.hits[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.documentRequestDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
