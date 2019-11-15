import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '@api/date';
import { ResultsTable } from '@components';
import { Button } from 'semantic-ui-react';

jest.mock('@pages/backoffice/components');
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

const mockViewDetails = jest.fn();
const columns = [
  {
    title: 'view',
    field: '',
    formatter: () => <Button onClick={mockViewDetails}>View</Button>,
  },
  { title: 'State', field: 'metadata.state' },
];

let component;
afterEach(() => {
  mockViewDetails.mockClear();
  component.unmount();
});

describe('LoansSearch ResultsTable tests', () => {
  it('should not render when empty results', () => {
    component = mount(<ResultsTable data={[]} columns={columns} />);
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    expect(component).toMatchSnapshot();
    const firstResult = data[0];
    const resultRows = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstResult.id);
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === `1-${firstResult.id}`
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.state);
  });

  it('should call click handler on view details click', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].id;
    const button = component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
