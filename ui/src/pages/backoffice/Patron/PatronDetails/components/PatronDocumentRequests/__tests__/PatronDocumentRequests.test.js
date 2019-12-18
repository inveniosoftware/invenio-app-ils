import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '@api/date';
import { BackOfficeRoutes } from '@routes/urls';
import PatronDocumentRequests from '../PatronDocumentRequests';
import { Button } from 'semantic-ui-react';

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

jest.mock('react-router-dom');
let mockViewDetails = jest.fn();

BackOfficeRoutes.documentRequestDetailsFor = jest.fn(pid => `url/${pid}`);

describe('PatronDocumentRequests tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const patron = {
    user_pid: '2',
    name: 'Name',
    email: 'name@test.ch',
  };

  it('should load the details component', () => {
    const mockedFetchPatronDocumentRequests = jest.fn();

    const component = shallow(
      <PatronDocumentRequests
        data={{ hits: [], total: 0 }}
        patronDetails={patron}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user document requests', () => {
    const mockedFetchPatronDocumentRequests = jest.fn();
    component = mount(
      <PatronDocumentRequests
        patronDetails={patron}
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
            patron: {
              id: 'patron_1',
              name: 'patron_1',
              email: 'patron_1@test.ch',
            },
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
            patron: {
              id: 'patron_2',
              name: 'patron_2',
              email: 'patron_2@test.ch',
            },
            state: 'PENDING',
            title: 'Test',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <PatronDocumentRequests
        patronDetails={patron}
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
            patron: {
              id: 'patron_1',
              name: 'patron_1',
              email: 'patron_1@test.ch',
            },
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
            patron: {
              id: 'patron_2',
              name: 'patron_2',
              email: 'patron_2@test.ch',
            },
            state: 'PENDING',
            title: 'Test',
          },
        },
      ],
      total: 2,
    };
    component = mount(
      <PatronDocumentRequests
        patronDetails={patron}
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
            patron: {
              id: 'patron_1',
              name: 'patron_1',
              email: 'patron_1@test.ch',
            },
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
        patronDetails={patron}
        data={data}
        fetchPatronDocumentRequests={mockedFetchPatronDocumentRequests}
        showMaxDocumentRequests={1}
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
