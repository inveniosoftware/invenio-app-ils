import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { ResultsTable } from '../ResultsTable';
import { Settings } from 'luxon';
import { Button } from 'semantic-ui-react';

Settings.defaultZoneName = 'utc';
const stringDate = '2018-01-01';
const data = [
  {
    pid: 'loan1',
    id: '1',
    patron_pid: 'patron_1',
    updated: stringDate,
    start_date: stringDate,
    end_date: stringDate,
  },
  {
    pid: 'loan2',
    id: '2',
    patron_pid: 'patron_2',
    updated: stringDate,
    start_date: stringDate,
    end_date: stringDate,
  },
];

const mockViewDetails = jest.fn();
const columns = [
  {
    title: 'view',
    field: '',
    formatter: () => <Button onClick={mockViewDetails}>View</Button>,
  },
  { title: 'ID', field: 'id' },
];

let component;

afterEach(() => {
  mockViewDetails.mockClear();
  if (component) {
    component.unmount();
  }
});

describe('ResultsTable tests', () => {
  it('should load the ResultTable component', () => {
    const component = shallow(<ResultsTable data={[]} columns={[]} />);
    expect(component).toMatchSnapshot();
  });

  it('should render the see all button when showing only a few rows', () => {
    const button = () => {
      return (
        <Button size="small" onClick={() => {}}>
          See all
        </Button>
      );
    };

    component = mount(
      <ResultsTable
        data={data}
        columns={columns}
        seeAllComponent={button()}
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
    component = mount(
      <ResultsTable data={data} columns={columns} showMaxRows={3} />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should click on view details', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].pid;
    const button = component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('button');
    button.simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });

  it('should call SeeAll click handler', () => {
    const mockedSeeAll = jest.fn();
    const buttonObj = () => {
      return (
        <Button size="small" onClick={() => mockedSeeAll()}>
          See all
        </Button>
      );
    };

    component = mount(
      <ResultsTable
        data={data}
        columns={columns}
        showMaxRows={1}
        seeAllComponent={buttonObj()}
      />
    );
    const button = component.find('TableFooter').find('button');
    button.simulate('click');
    expect(mockedSeeAll).toHaveBeenCalled();
  });
});
