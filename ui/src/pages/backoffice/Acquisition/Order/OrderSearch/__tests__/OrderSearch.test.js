import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '@api/date';
import { ResultsTable } from '@components';
import { Button } from 'semantic-ui-react';

jest.mock('@pages/backoffice/components');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');
const data = [
  {
    id: 3,
    created: stringDate,
    updated: stringDate,
    pid: '3',
    metadata: {
      pid: '3',
      authors: [{ full_name: 'Author1' }],
      title: 'This is a title',
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
  { title: 'Title', field: 'metadata.title' },
];

let component;
afterEach(() => {
  mockViewDetails.mockClear();
  component.unmount();
});

describe('OrdersSearch ResultsTable tests', () => {
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
      .filterWhere(
        element => element.prop('data-test') === firstResult.metadata.pid
      );
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === `1-${firstResult.metadata.pid}`
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.title);
  });

  it('should call click handler on view details click', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
