import React from 'react';
import { mount } from 'enzyme';
import { ResultsTable, formatter } from '../../../../common/components';

jest.mock('../../components');

describe('PatronsSearch ResultsList tests', () => {
  const data = [
    {
      metadata: {
        email: 'admin@test.ch',
        name: 'admin',
        id: 3,
        links: {
          self: 'https://localhost:5000/api/patrons/3',
        },
      },
    },
  ];

  let component;
  afterEach(() => {
    component.unmount();
  });

  it('should not render when empty results', () => {
    component = mount(
      <ResultsTable rows={[]} rowActionClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.patron.toTable(row))}
        rowActionClickHandler={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
    const firstResult = data[0].metadata;
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
    expect(mappedStatusElements.text()).toEqual(firstResult.email);

    mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === 'Name-' + firstResult.id
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.name);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.patron.toTable(row))}
        rowActionClickHandler={mockedClickHandler}
      />
    );
    const firstId = data[0].metadata.id;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = formatter.patron.toTable(data[0]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
