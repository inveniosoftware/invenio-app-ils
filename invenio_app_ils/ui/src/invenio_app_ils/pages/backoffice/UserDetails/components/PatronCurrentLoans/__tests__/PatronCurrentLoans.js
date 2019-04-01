import React from 'react';
import { shallow, mount } from 'enzyme';
import { generatePath } from 'react-router';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import { BackOfficeURLS } from '../../../../../../common/urls';
import PatronCurrentLoans from '../PatronCurrentLoans';

Settings.defaultZoneName = 'utc';
const d = fromISO('2018-01-01T11:05:00+01:00');

describe('PatronLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const patron = {
    patron_pid: 2,
  };

  it('should load the details component', () => {
    const mockedFetchPatronLoans = jest.fn();

    const component = shallow(
      <PatronCurrentLoans
        history={() => {}}
        data={{ hits: [], total: 0 }}
        loanState=""
        patron={patron.patron_pid}
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <PatronCurrentLoans
        patron={patron.patron_pid}
        history={() => {}}
        data={{ hits: [], total: 0 }}
        loanState=""
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render patron loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    const data = {
      hits: [
        {
          loan_pid: 'loan1',
          patron_pid: 'patron_1',
          updated: d,
          created: d,
          start_date: d,
          end_date: d,
          item: { barcode: '12345' },
        },
        {
          loan_pid: 'loan2',
          patron_pid: 'patron_1',
          updated: d,
          created: d,
          start_date: d,
          end_date: d,
          item: { barcode: '12345' },
        },
      ],
      total: 2,
    };

    component = mount(
      <PatronCurrentLoans
        patron={patron.patron_pid}
        history={() => {}}
        data={data}
        loanState=""
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
      />
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'loan1' ||
          element.prop('data-test') === 'loan2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few patron loans', () => {
    const mockedFetchPatronLoans = jest.fn();
    const data = {
      hits: [
        {
          loan_pid: 'loan1',
          patron_pid: 'patron_1',
          updated: d,
          created: d,
          start_date: d,
          end_date: d,
          item: { barcode: '12345' },
        },
        {
          loan_pid: 'loan2',
          patron_pid: 'patron_2',
          updated: d,
          created: d,
          start_date: d,
          end_date: d,
          item: { barcode: '12345' },
        },
      ],
      total: 2,
    };

    component = mount(
      <PatronCurrentLoans
        patron={patron.patron_pid}
        history={() => {}}
        data={data}
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
        showMaxLoans={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to loan details when clicking on a patron loan', () => {
    const mockedHistoryPush = jest.fn();
    const historyFn = {
      push: mockedHistoryPush,
    };

    const data = {
      hits: [
        {
          loan_pid: 'loan1',
          patron_pid: 'patron_1',
          updated: d,
          created: d,
          start_date: d,
          end_date: d,
          item: { barcode: '12345' },
        },
      ],
      total: 1,
    };

    const mockedFetchPatronLoans = jest.fn();
    component = mount(
      <PatronCurrentLoans
        patron={patron.patron_pid}
        history={historyFn}
        data={data}
        loanState=""
        fetchPatronCurrentLoans={mockedFetchPatronLoans}
        showMaxLoans={1}
      />
    );

    const firstId = data.hits[0].loan_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = generatePath(BackOfficeURLS.loanDetails, {
      loanPid: firstId,
    });
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam);
  });
});
