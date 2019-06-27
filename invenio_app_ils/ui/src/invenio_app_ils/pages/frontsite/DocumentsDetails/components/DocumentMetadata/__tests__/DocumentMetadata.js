import React from 'react';
import { mount } from 'enzyme';
import DocumentMetadata from '../DocumentMetadata';

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
      _computed: {
        eitems: [
          {
            description: 'Non ipsum',
            eitem_pid: '145',
            open_access: true,
          },
        ],
      },
      abstracts: [],
      authors: ['Est sit magnam quiquia.'],
      booklinks: [],
      chapters: [],
      circulation: {},
      document_pid: '71',
      document_types: ['BOOK'],
      files: [],
      keyword_pids: ['24'],
      keywords: [],
      languages: ['el', 'ro', 'fr', 'it', 'es'],
      publishers: ['Quiquia amet consectetur velit.'],
      related_records: [],
      series: {},
    },
  };

  it('should render the document correctly', () => {
    component = mount(<DocumentMetadata documentsDetails={documentDetails} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('DocumentMetadata')
      .find('Segment')
      .filterWhere(
        element =>
          element.prop('data-test') === documentDetails.metadata.document_pid
      );
    expect(rows).toHaveLength(1);
  });
});
