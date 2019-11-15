import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentRequestDetails from '../DocumentRequestDetails';

jest.mock('../components/', () => {
  return {
    DocumentRequestMetadata: () => null,
  };
});

describe('DocumentRequestDetails tests', () => {
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
    params: {},
  };

  it('should load the details component', () => {
    const component = shallow(
      <DocumentRequestDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentRequestDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch documentRequest details on mount', () => {
    const mockedFetchDocumentRequests = jest.fn();
    component = mount(
      <DocumentRequestDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentRequestDetails={mockedFetchDocumentRequests}
      />
    );
    expect(mockedFetchDocumentRequests).toHaveBeenCalled();
  });
});
