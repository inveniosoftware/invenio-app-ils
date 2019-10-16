import React from 'react';
import omit from 'lodash/omit';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '../../../../common/api/date';
import { ResultsTable, formatter } from '../../../../common/components';

jest.mock('../../components');

Settings.defaultZoneName = 'utc';

describe('ItemsSearch ResultsList tests', () => {
  const stringDate = fromISO('2018-01-01T11:05:00+01:00');

  const data = [
    {
      id: 987,
      created: toISO(stringDate),
      metadata: {
        pid: 987,
        barcode: '9865745223',
        document_pid: 1342,
        document: {
          pid: 1342,
        },
        status: 'IN_BINDING',
        internal_location_pid: 1,
        internal_location: {
          name: 'A library',
          pid: 1,
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
        rows={data.map(row => formatter.item.toTable(row))}
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
          element.prop('data-test') === 'Status-' + firstResult.metadata.pid
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.status);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.item.toTable(row))}
        rowActionClickHandler={mockedClickHandler}
      />
    );
    const firstId = data[0].metadata.pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    const expected = formatter.item.toTable(data[0]);
    expect(mockedClickHandler).toHaveBeenCalledWith(expected);
  });
});
