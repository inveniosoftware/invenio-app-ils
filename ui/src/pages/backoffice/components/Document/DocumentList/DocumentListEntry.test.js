import React from 'react';
import { shallow } from 'enzyme';
import DocumentListEntry from './DocumentListEntry';
import * as testData from '@testData/documents.json';

describe('DocumentCirculation tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const document = {
    metadata: {
      ...testData[0],
      items: { total: 2 },
      circulation: { has_items_for_loan: 2 },
      relations: { multipart_monograph: {}, serials: {} },
      eitems: { total: 0 },
    },
  };

  it('should load the DocumentCirculation component', () => {
    const component = shallow(<DocumentListEntry document={document} />);
    expect(component).toMatchSnapshot();
  });
});
