import React from 'react';
import { mount } from 'enzyme';
import DocumentAccordion from '../DocumentAccordion';

describe('DocumentAccordion tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const documentMetadata = {
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
  };

  it('should render the document correctly', () => {
    component = mount(
      <DocumentAccordion documentMetadata={documentMetadata} />
    );
    expect(component).toMatchSnapshot();

    const rows = component
      .find('DocumentAccordion')
      .find('Accordion')
      .filterWhere(
        element => element.prop('data-test') === documentMetadata.document_pid
      );
    expect(rows).toHaveLength(1);
  });
});
