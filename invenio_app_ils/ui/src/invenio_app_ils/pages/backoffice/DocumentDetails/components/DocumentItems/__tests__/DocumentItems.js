import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '../../../../../../routes/urls';
import DocumentItems from '../DocumentItems';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';
import history from '../../../../../../history';

jest.mock('../../../../../../common/config');

Settings.defaultZoneName = 'utc';
const stringDate = fromISO('2018-01-01T11:05:00+01:00');

describe('DocumentItems tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const doc = {
    document_pid: 111,
    metadata: {
      document_pid: 111,
    },
  };

  it('should load the DocumentItems component', () => {
    const component = shallow(
      <DocumentItems
        document={doc}
        data={{ hits: [], total: 0 }}
        fetchDocumentItems={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchDocumentItems = jest.fn();
    component = mount(
      <DocumentItems
        document={doc}
        data={{ hits: [], total: 0 }}
        fetchDocumentItems={mockedFetchDocumentItems}
      />
    );
    expect(mockedFetchDocumentItems).toHaveBeenCalledWith(doc.document_pid);
  });

  it('should render show a message with no items', () => {
    component = mount(
      <DocumentItems
        document={doc}
        data={{ hits: [], total: 0 }}
        fetchDocumentItems={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere(element => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render item', () => {
    const data = {
      hits: [
        {
          ID: '1',
          updated: stringDate,
          created: stringDate,
          item_pid: 'item1',
          metadata: {
            document_pid: 'doc1',
            item_pid: 'item1',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
          },
        },
        {
          id: '2',
          updated: stringDate,
          created: stringDate,
          item_pid: 'item2',
          metadata: {
            document_pid: 'doc2',
            item_pid: 'item2',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <DocumentItems document={doc} data={data} fetchDocumentItems={() => {}} />
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        element =>
          element.prop('data-test') === 'item1' ||
          element.prop('data-test') === 'item2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few items', () => {
    const data = {
      hits: [
        {
          id: '1',
          updated: stringDate,
          created: stringDate,
          metadata: {
            document_pid: 'doc1',
            item_pid: 'item1',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
          },
        },
        {
          id: '2',
          updated: stringDate,
          created: stringDate,
          metadata: {
            document_pid: 'doc2',
            item_pid: 'item2',
            internal_location: { location: { name: 'Somewhere' } },
            barcode: '44444',
            shelf: 'P',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <DocumentItems
        document={doc}
        data={data}
        fetchDocumentItems={() => {}}
        showMaxItems={1}
      />
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere(element => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to items details when clicking on a item row', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    const data = {
      hits: [
        {
          ID: '1',
          updated: stringDate,
          created: stringDate,
          item_pid: 'item1',
          metadata: {
            document_pid: 'doc1',
            item_pid: 'item1',
            internal_location: { location: { name: 'Somewhere' } },
            shelf: 'P',
            barcode: '44444',
          },
        },
      ],
      total: 2,
    };

    component = mount(
      <DocumentItems
        document={doc}
        data={data}
        fetchDocumentItems={() => {}}
        showMaxItems={1}
      />
    );

    const firstId = data.hits[0].item_pid;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('i');
    button.simulate('click');

    const expectedParam = BackOfficeRoutes.itemDetailsFor(firstId);
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
