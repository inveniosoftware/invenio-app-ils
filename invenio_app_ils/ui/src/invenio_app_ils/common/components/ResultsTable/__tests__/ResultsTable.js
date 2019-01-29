import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { ResultsTable } from '../ResultsTable';
import { Settings } from 'luxon';

Settings.defaultZoneName = 'utc';

const d = '2018-01-01';

describe('ResultsTable tests', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the ResultTable component', () => {
    const component = shallow(
      <ResultsTable
        history={() => {}}
        rows={[]}
        showAllClickHandler={{}}
        actionClickHandler={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render the show all button when showing only a few rows', () => {
    const mockedShowAllClickHandler = jest.fn();

    const data = [
      {
        loan_pid: 'loan1',
        ID: '1',
        patron_pid: 'patron_1',
        updated: d,
        start_date: d,
        end_date: d,
      },
      {
        loan_pid: 'loan2',
        ID: '2',
        patron_pid: 'patron_2',
        updated: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ResultsTable
        history={() => {}}
        rows={data}
        showAllClickHandler={{
          handler: mockedShowAllClickHandler,
          params: 3,
        }}
        actionClickHandler={() => {}}
        showMaxRows={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    const showAll = footer.find('button');
    expect(footer).toHaveLength(1);
    expect(showAll).toHaveLength(1);
  });

  it('should not render the show all button when showing only a few rows', () => {
    const data = [
      {
        ID: 'loan1',
        patron_pid: 'patron_1',
        updated: d,
        start_date: d,
        end_date: d,
      },
      {
        ID: 'loan2',
        patron_pid: 'patron_2',
        updated: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ResultsTable
        history={() => {}}
        rows={data}
        showAllClickHandler={{}}
        actionClickHandler={() => {}}
        showMaxRows={3}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();

    const results = [
      {
        ID: 'loan1',
        patron_pid: 'patron_1',
        updated: d,
        start_date: d,
        end_date: d,
      },
      {
        ID: 'loan2',
        patron_pid: 'patron_2',
        updated: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ResultsTable
        rows={results}
        showAllClickHandler={{}}
        actionClickHandler={mockedClickHandler}
      />
    );
    const firstId = results[0].ID;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    expect(mockedClickHandler).toHaveBeenCalledWith(firstId);
  });

  it('should call show all click handler on show all click', () => {
    const mockedClickHandler = jest.fn();
    const mockedShowAllClickHandler = jest.fn();

    const results = [
      {
        ID: 'loan1',
        patron_pid: 'patron_1',
        updated: d,
        start_date: d,
        end_date: d,
      },
      {
        ID: 'loan2',
        patron_pid: 'patron_2',
        updated: d,
        start_date: d,
        end_date: d,
      },
    ];

    component = mount(
      <ResultsTable
        rows={results}
        showMaxRows={1}
        showAllClickHandler={{
          handler: mockedShowAllClickHandler,
          params: 3,
        }}
        actionClickHandler={mockedClickHandler}
      />
    );
    const button = component.find('TableFooter').find('button');
    button.simulate('click');
    expect(mockedShowAllClickHandler).toHaveBeenCalledWith(3);
  });
});
