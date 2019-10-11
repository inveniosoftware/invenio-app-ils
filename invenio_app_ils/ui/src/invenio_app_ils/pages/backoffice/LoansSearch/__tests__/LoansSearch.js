import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '../../../../common/api/date';
import { ResultsTable } from '../../../../common/components';
import { formatter } from '../../../../common/components/ResultsTable/formatters';

jest.mock('../../components');
Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');
const start = stringDate.plus({ days: 1 });
const end = stringDate.plus({ months: 1 });

const data = [
  {
    id: 3,
    created: toISO(stringDate),
    metadata: {
      state: 'ITEM_ON_LOAN',
      patron_pid: 1,
      start_date: toISO(start),
      end_date: toISO(end),
      patron: { email: 'patron@test.ch' },
    },
  },
];

let component;
afterEach(() => {
  component.unmount();
});

describe('LoansSearch ResultsTable tests', () => {
  it('should not render when empty results', () => {
    component = mount(
      <ResultsTable rows={[]} rowActionClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.loan.toTable(row))}
        rowActionClickHandler={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
    const firstResult = data[0];
    const resultRows = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstResult.id);
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === 'State-' + firstResult.id
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.state);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.loan.toTable(row))}
        rowActionClickHandler={mockedClickHandler}
      />
    );
    const firstId = data[0].id;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = formatter.loan.toTable(data[0]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
