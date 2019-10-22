import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import ItemPastLoans from '../ItemPastLoans';
import testData from '../../../../../../../../../../tests/data/loans.json';

jest.mock('react-router-dom');
jest.mock('../../../../../../common/config/invenioConfig');
BackOfficeRoutes.loanDetailsFor = jest.fn(pid => `url/${pid}`);

const data = {
  hits: [
    {
      id: 1,
      pid: 'loan1',
      metadata: testData[0],
    },
    {
      id: 2,
      pid: 'loan2',
      metadata: testData[1],
    },
  ],
  total: 2,
};

describe('ItemPastLoans tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const item = {
    pid: 222,
    metadata: {
      document_pid: 111,
      pid: 222,
    },
  };

  it('should load the past loans component', () => {
    const component = shallow(
      <ItemPastLoans
        itemDetails={item}
        data={{ hits: [], total: 0 }}
        fetchPastLoans={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch past loans on mount', () => {
    const mockedFetchPastLoans = jest.fn();
    component = mount(
      <ItemPastLoans
        itemDetails={item}
        data={{ hits: [], total: 0 }}
        fetchPastLoans={mockedFetchPastLoans}
      />
    );
    expect(mockedFetchPastLoans).toHaveBeenCalledWith(item.pid);
  });

  it('should render show a message with no past loans', () => {
    component = mount(
      <ItemPastLoans
        itemDetails={item}
        data={{ hits: [], total: 0 }}
        fetchPastLoans={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render pending loans', () => {
    component = mount(
      <ItemPastLoans itemDetails={item} data={data} fetchPastLoans={() => {}} />
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
});
