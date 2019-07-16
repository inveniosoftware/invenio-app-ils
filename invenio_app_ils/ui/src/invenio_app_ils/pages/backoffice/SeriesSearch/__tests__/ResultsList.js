import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../common/api/date';
import { ResultsList } from '../components';
import { formatter } from '../../../../common/components/ResultsTable/formatters';

Settings.defaultZoneName = 'utc';

describe('SeriesSearch ResultsList tests', () => {
  const stringDate = fromISO('2018-01-01T11:05:00+01:00');

  const results = [
    {
      id: 3,
      created: stringDate,
      updated: stringDate,
      series_pid: '3',
      metadata: {
        authors: ['Author1'],
        title: { title: 'This is a title' },
        abstracts: 'This is an abstract',
        series_pid: '3',
        related_records: [],
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
        element => element.prop('data-test') === firstResult.metadata.series_pid
      );
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element =>
          element.prop('data-test') ===
          'Title-' + firstResult.metadata.series_pid
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(
      firstResult.metadata.title.title
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
    const firstId = results[0].series_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = formatter.series.toTable(results[0]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
