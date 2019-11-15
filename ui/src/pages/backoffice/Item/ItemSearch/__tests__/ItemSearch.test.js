import React from 'react';
import { Button } from 'semantic-ui-react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '@api/date';
import { ResultsTable } from '@components';

jest.mock('@pages/backoffice/components');

Settings.defaultZoneName = 'utc';

describe('ItemsSearch ResultsList tests', () => {
  const stringDate = fromISO('2018-01-01T11:05:00+01:00');

  const data = [
    {
      id: 987,
      created: toISO(stringDate),
      metadata: {
        pid: 987,
        barcode: '9865745223',
        document_pid: 1342,
        document: {
          pid: 1342,
        },
        status: 'IN_BINDING',
        internal_location_pid: 1,
        internal_location: {
          name: 'A library',
          pid: 1,
        },
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
    { title: 'Status', field: 'metadata.status' },
  ];

  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    component.unmount();
  });

  it('should not render when empty results', () => {
    component = mount(<ResultsTable data={[]} columns={[]} />);
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
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.status);
  });

  it('should call click handler on view details click', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].metadata.pid;
    const button = component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
