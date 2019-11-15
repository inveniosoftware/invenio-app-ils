import React from 'react';
import { mount } from 'enzyme';
import { ResultsTable } from '@components/';
import testData from '@testData/eitems.json';
import { Button } from 'semantic-ui-react';

jest.mock('@pages/backoffice/components');

let component;
const data = [
  { pid: testData[0].pid, metadata: testData[0] },
  { pid: testData[1].pid, metadata: testData[1] },
];

const mockViewDetails = jest.fn();
const columns = [
  {
    title: 'view',
    field: '',
    formatter: () => <Button onClick={mockViewDetails}>View</Button>,
  },
  { title: 'Description', field: 'metadata.description' },
];

afterEach(() => {
  mockViewDetails.mockClear();
  component.unmount();
});

describe('EItemsSearch ResultsTable tests', () => {
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

    expect(mappedStatusElements.text()).toEqual(
      firstResult.metadata.description
    );
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
