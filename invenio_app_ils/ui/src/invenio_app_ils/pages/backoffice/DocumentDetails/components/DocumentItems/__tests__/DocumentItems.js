import React from 'react';
import { shallow, mount } from 'enzyme';
import { generatePath } from 'react-router';
import { BackOfficeURLS } from '../../../../../../common/urls';
import DocumentItems from '../DocumentItems';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../common/api/date';

Settings.defaultZoneName = 'utc';
const d = fromISO('2018-01-01T11:05:00+01:00');

describe('DocumentItems tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const doc = {
    metadata: {
      document_pid: 111,
    },
  };

  it('should load the DocumentItems component', () => {
    const component = shallow(
      <DocumentItems
        document={doc}
        history={() => {}}
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
        history={() => {}}
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
        history={() => {}}
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
          ID: 'item1',
          document_pid: 'doc1',
          item_pid: 'item1',
          updated: d,
          location: 'Somewhere',
        },
        {
          ID: 'item2',
          document_pid: 'doc2',
          item_pid: 'item2',
          updated: d,
          location: 'Somewhere',
        },
      ],
      total: 2,
    };

    component = mount(
      <DocumentItems
        document={doc}
        history={() => {}}
        data={data}
        fetchDocumentItems={() => {}}
      />
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
          ID: '1',
          document_pid: 'doc1',
          item_pid: 'item1',
          updated: d,
          location: 'Somewhere',
        },
        {
          ID: '2',
          document_pid: 'doc2',
          item_pid: 'item2',
          updated: d,
          location: 'Somewhere',
        },
      ],
      total: 2,
    };

    component = mount(
      <DocumentItems
        document={doc}
        history={() => {}}
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
    const historyFn = {
      push: mockedHistoryPush,
    };

    const data = {
      hits: [
        {
          ID: '1',
          document_pid: 'doc1',
          item_pid: 'item1',
          updated: d,
          location: 'Somewhere',
        },
      ],
      total: 2,
    };

    component = mount(
      <DocumentItems
        document={doc}
        history={historyFn}
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

    const expectedParam = generatePath(BackOfficeURLS.itemDetails, {
      itemPid: firstId,
    });
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam);
  });
});
