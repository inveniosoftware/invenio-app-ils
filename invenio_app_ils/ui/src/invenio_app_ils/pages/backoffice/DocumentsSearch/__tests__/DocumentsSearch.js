import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../common/api/date';
import { ResultsTable, formatter } from '../../../../common/components';

jest.mock('react-router-dom');
jest.mock('../../components');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');
const data = [
  {
    id: 3,
    created: stringDate,
    updated: stringDate,
    pid: '3',
    metadata: {
      pid: '3',
      authors: [{ full_name: 'Author1' }],
      title: 'This is a title',
    },
  },
];

const mockRowActionClickHandler = jest.fn();
mockRowActionClickHandler.mockImplementation(pid => `/documents/${pid}`);

let component;
afterEach(() => {
  component.unmount();
});

describe('DocumentsSearch ResultsTable tests', () => {
  it('should not render when empty results', () => {
    component = mount(
      <ResultsTable
        rows={[]}
        rowActionClickHandler={mockRowActionClickHandler}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.document.toTable(row))}
        rowActionClickHandler={mockRowActionClickHandler}
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
          element.prop('data-test') === 'Title-' + firstResult.metadata.pid
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.title);
  });

  it('should call click handler on view details click', () => {
    component = mount(
      <ResultsTable
        rows={data.map(row => formatter.document.toTable(row))}
        rowActionClickHandler={mockRowActionClickHandler}
      />
    );
    const firstId = data[0].pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    expect(mockRowActionClickHandler).toHaveBeenCalledWith(firstId);
  });
});
