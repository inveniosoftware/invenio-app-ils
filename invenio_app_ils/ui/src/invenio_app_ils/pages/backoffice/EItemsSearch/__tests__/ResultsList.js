import React from 'react';
import omit from 'lodash/omit';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '../../../../common/api/date';
import { ResultsList } from '../components';
import { formatter } from '../../../../common/components/ResultsTable/formatters';

Settings.defaultZoneName = 'utc';

describe('EItemsSearch ResultsList tests', () => {
  const stringDate = fromISO('2018-01-01T11:05:00+01:00');

  const results = [
    {
      id: 987,
      created: toISO(stringDate),
      updated: toISO(stringDate),
      metadata: {
        eitem_pid: 987,
        description: 'A description.',
        document_pid: 1342,
        document: {
          document_pid: 1342,
        },
        internal_notes: 'Internal notes.',
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
        element => element.prop('data-test') === firstResult.metadata.eitem_pid
      );
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element =>
          element.prop('data-test') ===
          'Description-' + firstResult.metadata.eitem_pid
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(
      firstResult.metadata.description
    );
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsList
        results={results}
        viewDetailsClickHandler={mockedClickHandler}
      />
    );
    const firstId = results[0].metadata.eitem_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = omit(formatter.eitem.toTable(results[0]), [
      'Created',
      'Updated',
    ]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
