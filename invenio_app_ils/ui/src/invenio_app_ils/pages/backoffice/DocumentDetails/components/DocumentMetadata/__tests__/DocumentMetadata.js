import * as testData from '../../../../../../../../../../tests/data/documents.json';
import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentMetadata from '../DocumentMetadata';
import { invenioConfig } from '../../../../../../common/config';

jest.mock('../../../../../../common/config/invenioConfig');

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

jest.mock('../../../../../../common/components/ESSelector', () => {
  return {
    ESSelector: () => null,
  };
});

describe('DocumentDetailsContainer tests', () => {
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

  it('should fetch document details on mount', () => {
    component = mount(
      <DocumentMetadata documentDetails={{ metadata: testData[0] }} />
    );
  });
});
