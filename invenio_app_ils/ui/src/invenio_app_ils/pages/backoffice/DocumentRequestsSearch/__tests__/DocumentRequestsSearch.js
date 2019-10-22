import React from 'react';
import { Button } from 'semantic-ui-react';
import { mount } from 'enzyme';
import { ResultsTable } from '../../../../common/components';

jest.mock('../../components');

const data = [
  {
    id: 3,
    pid: '3',
    metadata: {
      authors: 'Author1',
      title: 'This is a title',
      state: 'PENDING',
      patron_pid: '1',
      patron: { name: 'John Doe' },
      pid: '3',
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

describe('DocumentRequestsSearch ResultsTable tests', () => {
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
        element =>
          element.prop('data-test') === `Title-${firstResult.metadata.pid}`
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.title);
  });

  it('should call click handler on view details click', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].pid;
    const button = component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `view-${firstId}`)
      .find('button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
