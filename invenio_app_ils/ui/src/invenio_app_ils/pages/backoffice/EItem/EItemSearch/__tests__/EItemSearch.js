import React from 'react';
import { mount } from 'enzyme';
import { ResultsTable, formatter } from '../../../../../common/components/';
import testData from '../../../../../../../../../tests/data/eitems.json';

jest.mock('../../../components');

let component;
const data = [
  { pid: testData[0].pid, metadata: testData[0] },
  { pid: testData[1].pid, metadata: testData[1] },
];

afterEach(() => {
  component.unmount();
});

describe('EItemsSearch ResultsTable tests', () => {
  it('should not render when empty results', () => {
    component = mount(
      <ResultsTable rows={[]} rowActionClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.eitem.toTable(row))}
        rowActionClickHandler={() => {}}
      />
    );
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
          element.prop('data-test') ===
          'Description-' + firstResult.metadata.pid
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(
      firstResult.metadata.description
    );
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.eitem.toTable(row))}
        rowActionClickHandler={mockedClickHandler}
      />
    );
    const firstId = data[0].metadata.pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = formatter.eitem.toTable(data[0]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
