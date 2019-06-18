import React from 'react';
import omit from 'lodash/omit';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '../../../../common/api/date';
import { ResultsList } from '../components';
import { formatter } from '../../../../common/components/ResultsTable/formatters';

Settings.defaultZoneName = 'utc';

describe('ItemsSearch ResultsList tests', () => {
  const stringDate = fromISO('2018-01-01T11:05:00+01:00');

  const results = [
    {
      id: 987,
      created: toISO(stringDate),
      metadata: {
        item_pid: 987,
        barcode: '9865745223',
        document_pid: 1342,
        document: {
          document_pid: 1342,
        },
        status: 'IN_BINDING',
        internal_location_pid: 1,
        internal_location: {
          name: 'A library',
          internal_location_pid: 1,
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
      .filterWhere(
        element => element.prop('data-test') === firstResult.metadata.item_pid
      );
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element =>
          element.prop('data-test') ===
          'Status-' + firstResult.metadata.item_pid
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.status);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsList
        results={results}
        viewDetailsClickHandler={mockedClickHandler}
      />
    );
    const firstId = results[0].metadata.item_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = omit(formatter.item.toTable(results[0]), [
      'Created',
      'Updated',
    ]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
