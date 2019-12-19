import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentDetails from '../DocumentDetails';
import testData from '@testData/documents.json';


jest.mock('../components/', () => {
  return {
    DocumentActionMenu: () => null,
    DocumentMetadata: () => null,
    DocumentPendingLoans: () => null,
    DocumentItems: () => null,
    DocumentRelations: () => null,
    DocumentStats: () => null,
  };
});

jest.mock('../', () => {
  return {
    DocumentHeader: () => null,
    DocumentContent: () => null,
  };
});

describe('DocumentDetails tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerHistory = {
    listen: () => () => {},
  };
  const routerUrlParams = {
    params: {
      documentPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <DocumentDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch document details on mount', () => {
    const mockedFetchDocumentDetails = jest.fn();
    component = mount(
      <DocumentDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentDetails={mockedFetchDocumentDetails}
        data={{ metadata: testData[0] }}
      />
    );
    expect(mockedFetchDocumentDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});
