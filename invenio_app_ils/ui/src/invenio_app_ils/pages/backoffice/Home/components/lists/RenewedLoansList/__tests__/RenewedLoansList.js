import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../../common/api/date';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import RenewedLoansList from '../RenewedLoansList';
import history from '../../../../../../../history';

jest.mock('../../../../../../../common/config');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('RenewedLoansList tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const component = shallow(
      <RenewedLoansList
        data={{ hits: [], total: 0 }}
        fetchRenewedLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch loans on mount', () => {
    const mockedFetchLoans = jest.fn();
    component = mount(
      <RenewedLoansList
        data={{ hits: [], total: 0 }}
        fetchRenewedLoans={mockedFetchLoans}
      />
    );
    expect(mockedFetchLoans).toHaveBeenCalled();
  });

  it('should render show a message with no loans', () => {
    component = mount(
      <RenewedLoansList
        data={{ hits: [], total: 0 }}
        fetchRenewedLoans={() => {}}
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
          id: 1,
          updated: stringDate,
          created: stringDate,
          pid: 'loan1',
          metadata: {
            pid: 'loan1',
            patron_pid: 'patron_1',
            start_date: stringDate,
            end_date: stringDate,
          },
        },
        {
          id: 2,
          updated: stringDate,
          created: stringDate,
          pid: 'loan2',
          metadata: {
            pid: 'loan2',
            patron_pid: 'patron_2',
            start_date: stringDate,
            end_date: stringDate,
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <RenewedLoansList data={data} fetchRenewedLoans={() => {}} />
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
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          id: 1,
          updated: stringDate,
          created: stringDate,
          pid: 'loan1',
          metadata: {
            pid: 'loan1',
            patron_pid: 'patron_1',
            start_date: stringDate,
            end_date: stringDate,
          },
        },
      ],
      total: 1,
    };

    component = mount(
      <RenewedLoansList
        data={data}
        fetchRenewedLoans={() => {}}
        showMaxEntries={1}
      />
    );

    const firstId = data.hits[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.loanDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
