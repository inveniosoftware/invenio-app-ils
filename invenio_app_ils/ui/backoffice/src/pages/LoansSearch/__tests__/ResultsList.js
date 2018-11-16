import React from 'react';
import { mount } from 'enzyme';
import { formatDate } from 'common/api/base';
import { ResultsList } from '../components';

describe('LoansSearch ResultsList tests', () => {
  // eslint-disable-next-line no-extend-native
  Date.prototype.getTimezoneOffset = () => 0;

  const d = new Date(2018, 1, 1, 11, 5, 0);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3);

  const results = [
    {
      id: 3,
      created: formatDate(d),
      metadata: {
        state: 'ITEM_ON_LOAN',
        patron_pid: 1,
        start_date: formatDate(start),
        end_date: formatDate(end),
      },
    },
  ];

  let component;
  afterEach(() => {
    component.unmount();
  });

  it('should not render when empty results', () => {
    component = mount(
      <ResultsList results={[]} viewDetailsClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(
      <ResultsList results={results} viewDetailsClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
    const firstResult = results[0];
    const resultRows = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstResult.id);
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === 'mapped-status');
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.state);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsList
        results={results}
        viewDetailsClickHandler={mockedClickHandler}
      />
    );
    const firstId = results[0].id;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    expect(mockedClickHandler).toHaveBeenCalledWith(firstId);
  });
});
