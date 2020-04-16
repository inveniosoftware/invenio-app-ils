import React from 'react';
import { mount } from 'enzyme';
import LoanRequestForm from '../LoanRequestForm';
import * as testData from '@testData/documents.json';
import { DateTime } from 'luxon';

jest.mock('@config/invenioConfig');

describe('DocumentMetadata tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const mockRequestLoanForDocument = jest.fn();

  const document = {
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

  it('should render the loan request form correctly', () => {
    DateTime.local = jest
      .fn()
      .mockReturnValue(DateTime.fromObject({ year: 2019, month: 10, day: 1 }));
    component = mount(
      <LoanRequestForm
        document={document}
        requestLoanForDocument={mockRequestLoanForDocument}
        initializeState={() => {}}
      />
    );

    expect(component).toMatchSnapshot();

    const fields = component
      .find('LoanRequestForm')
      .find('DateInput')
      .filterWhere(element => element.prop('data-test') === '');
    expect(fields).toHaveLength(1);
  });
});
