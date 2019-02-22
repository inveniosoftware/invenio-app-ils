import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { ResultsTable } from '../ResultsTable';
import { Settings } from 'luxon';
import { Button } from 'semantic-ui-react';

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
        rowActionClickHandler={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render the see all button when showing only a few rows', () => {
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

    const button = () => {
      return (
        <Button size="small" onClick={() => {}}>
          See all
        </Button>
      );
    };

    component = mount(
      <ResultsTable
        history={() => {}}
        rows={data}
        seeAllComponent={button()}
        rowActionClickHandler={() => {}}
        showMaxRows={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    const seeAll = footer.find('button');
    expect(footer).toHaveLength(1);
    expect(seeAll).toHaveLength(1);
  });

  it('should not render the see all button when showing only a few rows', () => {
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
        rowActionClickHandler={() => {}}
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
      <ResultsTable rows={results} rowActionClickHandler={mockedClickHandler} />
    );
    const firstId = results[0].ID;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    expect(mockedClickHandler).toHaveBeenCalledWith(firstId);
  });

  it('should call see all click handler on see all click', () => {
    const mockedHistoryPush = jest.fn();
    const historyFn = {
      push: mockedHistoryPush,
    };

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

    const buttonObj = () => {
      return (
        <Button
          size="small"
          onClick={() => {
            mockedHistoryPush();
          }}
        >
          See all
        </Button>
      );
    };

    component = mount(
      <ResultsTable
        rows={results}
        showMaxRows={1}
        history={historyFn}
        seeAllComponent={buttonObj()}
        rowActionClickHandler={() => {}}
      />
    );

    const button = component.find('TableFooter').find('button');
    button.simulate('click');
    expect(mockedHistoryPush).toHaveBeenCalled();
  });
});
