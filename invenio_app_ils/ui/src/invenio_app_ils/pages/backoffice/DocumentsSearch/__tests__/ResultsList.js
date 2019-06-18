import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../common/api/date';
import { ResultsList } from '../components';
import { formatter } from '../../../../common/components/ResultsTable/formatters';

Settings.defaultZoneName = 'utc';

describe('DocumentsSearch ResultsList tests', () => {
  const stringDate = fromISO('2018-01-01T11:05:00+01:00');

  const results = [
    {
      id: 3,
      created: stringDate,
      updated: stringDate,
      document_pid: '3',
      metadata: {
        authors: ['Author1'],
        title: 'This is a title',
        abstracts: 'This is an abstract',
        document_pid: '3',
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
        element =>
          element.prop('data-test') === firstResult.metadata.document_pid
      );
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element =>
          element.prop('data-test') ===
          'Title-' + firstResult.metadata.document_pid
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.title);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsList
        results={results}
        viewDetailsClickHandler={mockedClickHandler}
      />
    );
    const firstId = results[0].document_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = formatter.document.toTable(results[0]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
