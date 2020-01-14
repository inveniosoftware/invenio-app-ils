import React from 'react';
import { shallow, mount } from 'enzyme';
import { BackOfficeRoutes } from '@routes/urls';
import DocumentItems from '../DocumentItems';
import testData from '@testData/items.json';

jest.mock('react-router-dom');
BackOfficeRoutes.itemDetailsFor = jest.fn(pid => `url/${pid}`);

const data = {
  hits: [
    {
      ID: '1',
      pid: 'item1',
      metadata: {
        ...testData[0],
        document: { title: 'Document 1 title' },
        internal_location: { location: { name: 'Somewhere' } },
        shelf: 'Shelf 1',
      },
    },
    {
      id: '2',
      pid: 'item2',
      metadata: {
        ...testData[1],
        document: { title: 'Document 2 title' },
        internal_location: { location: { name: 'Somewhere Else' } },
        shelf: 'Shelf 2',
      },
    },
  ],
  total: 2,
};

describe('DocumentItems tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const doc = {
    pid: 111,
    metadata: {
      pid: 111,
    },
  };

  it('should load the DocumentItems component', () => {
    const component = shallow(
      <DocumentItems
        documentDetails={doc}
        documentItems={{ hits: [], total: 0 }}
        fetchDocumentItems={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch pending loans on mount', () => {
    const mockedFetchDocumentItems = jest.fn();
    component = mount(
      <DocumentItems
        documentDetails={doc}
        documentItems={{ hits: [], total: 0 }}
        fetchDocumentItems={mockedFetchDocumentItems}
      />
    );
    expect(mockedFetchDocumentItems).toHaveBeenCalledWith(doc.pid);
  });

  it('should render show a message with no items', () => {
    component = mount(
      <DocumentItems
        documentDetails={doc}
        documentItems={{ hits: [], total: 0 }}
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
    component = mount(
      <DocumentItems
        documentDetails={doc}
        documentItems={data}
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
    component = mount(
      <DocumentItems
        documentDetails={doc}
        documentItems={data}
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
});
