import React from 'react';
import { mount } from 'enzyme';
import { ResultsTable } from '../../../../common/components';
import { Button } from 'semantic-ui-react';

jest.mock('../../components');

const data = [
  {
    id: 3,
    metadata: {
      email: 'admin@test.ch',
      name: 'admin',
      links: {
        self: 'https://localhost:5000/api/patrons/3',
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
  { title: 'ID', field: 'metadata.id' },
  { title: 'Name', field: 'metadata.name' },
  { title: 'Email', field: 'metadata.email' },
];

describe('PatronsSearch ResultsList tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    component.unmount();
  });

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

    let mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === 'Email-' + firstResult.id
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.email);

    mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === 'Name-' + firstResult.id
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.name);
  });

  it('should call click handler on view details click', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].id;
    const button = component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `view-${firstId}`)
      .find('button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
