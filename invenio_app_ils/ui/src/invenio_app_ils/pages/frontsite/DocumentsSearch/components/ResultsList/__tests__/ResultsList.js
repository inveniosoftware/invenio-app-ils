import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import { ResultsList } from '../ResultsList';

jest.mock('../../../../../../common/config');

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
        _computed: {
          eitems: [],
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
      .find('DocumentItem')
      .filterWhere(
        element =>
          element.prop('data-test') === firstResult.metadata.document_pid
      );
    expect(resultRows).toHaveLength(1);
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
      .find('DocumentItem')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('ItemExtra')
      .find('button');
    button.simulate('click');
    expect(mockedClickHandler).toHaveBeenCalledWith(firstId);
  });
});
