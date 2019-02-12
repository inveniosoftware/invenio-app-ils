import React from 'react';
import { shallow, mount } from 'enzyme';
import { generatePath } from 'react-router';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import { BackOfficeURLS } from '../../../../../../common/urls';
import ItemPendingLoans from '../ItemPendingLoans';

Settings.defaultZoneName = 'utc';
const d = fromISO('2018-01-01T11:05:00+01:00');

describe('ItemPendingLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const item = {
    metadata: {
      document_pid: 111,
      item_pid: 222,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <ItemPendingLoans
        item={item}
        history={() => {}}
        data={[]}
        fetchPendingLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchPendingLoans = jest.fn();
    component = mount(
      <ItemPendingLoans
        item={item}
        history={() => {}}
        data={[]}
        fetchPendingLoans={mockedFetchPendingLoans}
      />
    );
    expect(mockedFetchPendingLoans).toHaveBeenCalledWith(item.item_pid);
  });

  it('should render show a message with no pending loans', () => {
    component = mount(
      <ItemPendingLoans
        item={item}
        history={() => {}}
        data={[]}
        fetchPendingLoans={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render pending loans', () => {
    const data = [
      {
        loan_pid: 'loan1',
        patron_pid: 'patron_1',
        updated: d,
        created: d,
        start_date: d,
        end_date: d,
      },
      {
        loan_pid: 'loan2',
        patron_pid: 'patron_2',
        updated: d,
        created: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ItemPendingLoans
        item={item}
        history={() => {}}
        data={data}
        fetchPendingLoans={() => {}}
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

  it('should render the show all button when showing only a few pending loans', () => {
    const data = [
      {
        loan_pid: 'loan1',
        patron_pid: 'patron_1',
        updated: d,
        created: d,
        start_date: d,
        end_date: d,
      },
      {
        loan_pid: 'loan2',
        patron_pid: 'patron_2',
        updated: d,
        created: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ItemPendingLoans
        item={item}
        history={() => {}}
        data={data}
        fetchPendingLoans={() => {}}
        showMaxPendingLoans={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to loan details when clicking on a pending loan', () => {
    const mockedHistoryPush = jest.fn();
    const historyFn = {
      push: mockedHistoryPush,
    };

    const data = [
      {
        loan_pid: 'loan1',
        patron_pid: 'patron_1',
        updated: d,
        created: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ItemPendingLoans
        item={item}
        history={historyFn}
        data={data}
        fetchPendingLoans={() => {}}
        showMaxPendingLoans={1}
      />
    );

    const firstId = data[0].loan_pid;
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
