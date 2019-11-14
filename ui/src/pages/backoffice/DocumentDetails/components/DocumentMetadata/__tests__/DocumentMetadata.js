import * as testData from '@testData/documents.json';
import React from 'react';
import { shallow } from 'enzyme';
import DocumentMetadata from '../DocumentMetadata';

jest.mock('@config/invenioConfig');

jest.mock('../../DocumentMetadata', () => {
  return {
    DocumentMetadata: () => null,
  };
});

jest.mock('../../../../components/DeleteRecordModal', () => {
  return {
    DeleteRecordModal: () => null,
  };
});

jest.mock('@components/ESSelector', () => {
  return {
    ESSelector: () => null,
  };
});

describe('DocumentMetadata tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const component = shallow(
      <DocumentMetadata documentDetails={{ metadata: testData[0] }} />
    );
    expect(component).toMatchSnapshot();
  });
});
