import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../../common/api/date';
import { viewLoanDetailsUrl } from '../../../../../../../common/urls';
import IdleLoansList from '../IdleLoansList';

Settings.defaultZoneName = 'utc';
const d = fromISO('2018-01-01T11:05:00+01:00');
const str_date = '2018-01-01T11:05:00+01:00';

describe('IdleLoansList tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const component = shallow(
      <IdleLoansList
        history={() => {}}
        data={{ hits: [], total: 0 }}
        fetchIdlePendingLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch loans on mount', () => {
    const mockedFetchLoans = jest.fn();
    component = mount(
      <IdleLoansList
        history={() => {}}
        data={{ hits: [], total: 0 }}
        fetchIdlePendingLoans={mockedFetchLoans}
      />
    );
    expect(mockedFetchLoans).toHaveBeenCalled();
  });

  it('should render show a message with no loans', () => {
    component = mount(
      <IdleLoansList
        history={() => {}}
        data={{ hits: [], total: 0 }}
        fetchIdlePendingLoans={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render loans', () => {
    const data = {
      hits: [
        {
          loan_pid: 'loan1',
          patron_pid: 'patron_1',
          updated: d,
          created: d,
          start_date: str_date,
          end_date: str_date,
        },
        {
          loan_pid: 'loan2',
          patron_pid: 'patron_2',
          updated: d,
          created: d,
          start_date: str_date,
          end_date: str_date,
        },
      ],
      total: 2,
    };

    component = mount(
      <IdleLoansList
        history={() => {}}
        data={data}
        fetchIdlePendingLoans={() => {}}
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

  it('should go to loan details when clicking on a loan', () => {
    const mockedHistoryPush = jest.fn();
    const historyFn = {
      push: mockedHistoryPush,
    };

    const data = {
      hits: [
        {
          ID: 'loan1',
          loan_pid: 'loan1',
          patron_pid: 'patron_1',
          updated: d,
          created: d,
          start_date: str_date,
          end_date: str_date,
        },
      ],
      total: 1,
    };

    component = mount(
      <IdleLoansList
        history={historyFn}
        data={data}
        fetchIdlePendingLoans={() => {}}
        showMaxEntries={1}
      />
    );

    const firstId = data.hits[0].loan_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = viewLoanDetailsUrl(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam);
  });
});
