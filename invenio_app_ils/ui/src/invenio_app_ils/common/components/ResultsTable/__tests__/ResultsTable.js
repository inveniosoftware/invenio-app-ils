import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { ResultsTable } from '../ResultsTable';
import { Settings } from 'luxon';
import { Button } from 'semantic-ui-react';
import history from '../../../../history';
import { invenioConfig } from '../../../config';
import { invenioConfig as configMock } from '../../../__mocks__/config';

Settings.defaultZoneName = 'utc';

const stringDate = '2018-01-01';

describe('ResultsTable tests', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the ResultTable component', () => {
    const component = shallow(
      <ResultsTable rows={[]} rowActionClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render the see all button when showing only a few rows', () => {
    const data = [
      {
        loan_pid: 'loan1',
        ID: '1',
        patron_pid: 'patron_1',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
      {
        loan_pid: 'loan2',
        ID: '2',
        patron_pid: 'patron_2',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
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
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
      {
        ID: 'loan2',
        patron_pid: 'patron_2',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
    ];

    component = mount(
      <ResultsTable
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
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
      {
        ID: 'loan2',
        patron_pid: 'patron_2',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
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
    expect(mockedClickHandler).toHaveBeenCalledWith(results[0]);
  });

  it('should call see all click handler on see all click', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const results = [
      {
        ID: 'loan1',
        patron_pid: 'patron_1',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
      {
        ID: 'loan2',
        patron_pid: 'patron_2',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
    ];

    const buttonObj = () => {
      return (
        <Button size="small" onClick={() => mockedHistoryPush()}>
          See all
        </Button>
      );
    };

    component = mount(
      <ResultsTable
        rows={results}
        showMaxRows={1}
        seeAllComponent={buttonObj()}
        rowActionClickHandler={() => {}}
      />
    );

    const button = component.find('TableFooter').find('button');
    button.simulate('click');
    expect(mockedHistoryPush).toHaveBeenCalled();
  });

  it('should show the view details button when the rowActionClickHandler prop is defined', () => {
    const results = [
      {
        ID: 'loan1',
        patron_pid: 'patron_1',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
    ];

    component = mount(
      <ResultsTable rows={results} rowActionClickHandler={() => {}} />
    );

    const firstId = results[0].ID;
    const button = component
      .find('TableRow')
      .find('button')
      .filterWhere(
        element => element.prop('data-test') === 'btn-view-details-' + firstId
      );
    expect(button).toHaveLength(1);
  });

  it('should not show the view details button when the rowActionClickHandler prop is not defined', () => {
    const results = [
      {
        ID: 'loan1',
        patron_pid: 'patron_1',
        updated: stringDate,
        start_date: stringDate,
        end_date: stringDate,
      },
    ];

    component = mount(<ResultsTable rows={results} />);

    const firstId = results[0].ID;
    const button = component
      .find('TableRow')
      .find('button')
      .filterWhere(
        element => element.prop('data-test') === 'btn-view-details-' + firstId
      );
    expect(button).toHaveLength(0);
  });
});
