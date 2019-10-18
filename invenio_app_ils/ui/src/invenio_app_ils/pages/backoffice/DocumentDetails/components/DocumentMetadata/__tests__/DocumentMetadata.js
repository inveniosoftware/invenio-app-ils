import * as testData from '../../../../../../../../../../tests/data/documents.json';
import React from 'react';
import { shallow } from 'enzyme';
import DocumentMetadata from '../DocumentMetadata';
import { BackOfficeRoutes } from '../../../../../../routes/urls';

BackOfficeRoutes.documentEditFor = jest.fn(
  pid => `/backoffice/documents/${pid}/edit`
);
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
    ESSelectorLoanRequest: () => null,
    ESSelectorModal: () => null,
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
