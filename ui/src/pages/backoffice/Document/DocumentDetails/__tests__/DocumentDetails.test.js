import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentDetails from '../DocumentDetails';

jest.mock('../components/', () => {
  return {
    DocumentMetadata: () => null,
    DocumentPendingLoans: () => null,
    DocumentItems: () => null,
    DocumentRelations: () => null,
    DocumentStats: () => null,
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
        deleteDocument={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch document details on mount', () => {
    const mockedFetchDocumentDetails = jest.fn();
    const mockDeleteDocument = jest.fn();
    component = mount(
      <DocumentDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentDetails={mockedFetchDocumentDetails}
        deleteDocument={mockDeleteDocument}
      />
    );
    expect(mockedFetchDocumentDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});
