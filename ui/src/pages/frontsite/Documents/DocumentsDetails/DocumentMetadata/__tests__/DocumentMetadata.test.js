import React from 'react';
import { mount } from 'enzyme';
import * as testData from '@testData/documents.json';
import DocumentMetadata from '../DocumentMetadata';

jest.mock('@pages/frontsite/components/Document', () => {
  return {
    DocumentMetadataAccordion: () => null,
    DocumentMetadataTabs: () => null,
    DocumentStats: () => null,
  };
});

describe('DocumentMetadata tests', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const documentDetails = {
    id: 71,
    created: '2019-07-08T10:44:02.366+02:00',
    updated: '2019-07-08T10:44:18.354+02:00',
    links: { self: 'https://127.0.0.1:5000/api/documents/71' },
    metadata: {
      $schema: 'https://127.0.0.1:5000/schemas/documents/document-v1.0.0.json',
      _access: {},
      ...testData[0],
      relations: {},
      circulation: {},
      pid: '71',
      document_type: ['BOOK'],
      tags: [],
      eitems: {
        total: 1,
        hits: [
          {
            description: 'Non ipsum',
            pid: '145',
            open_access: true,
          },
        ],
      },
    },
  };

  it('should render the document correctly', () => {
    component = mount(<DocumentMetadata documentDetails={documentDetails} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('DocumentMetadata')
      .find('Container')
      .filterWhere(
        element => element.prop('data-test') === documentDetails.metadata.pid
      );
    expect(rows).toHaveLength(1);
  });
});
