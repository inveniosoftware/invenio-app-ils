import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentRequestDetailsContainer from '../DocumentRequestDetailsContainer';

jest.mock('../components/DocumentRequestDetails', () => {
  return {
    DocumentRequestDetails: () => null,
  };
});

describe('DocumentRequestDetailsContainer tests', () => {
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
      documentRequestPid: 879,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <DocumentRequestDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentRequestDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch documentRequest details on mount', () => {
    const mockedFetchDocumentRequestDetails = jest.fn();
    component = mount(
      <DocumentRequestDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentRequestDetails={mockedFetchDocumentRequestDetails}
      />
    );
    expect(mockedFetchDocumentRequestDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentRequestPid
    );
  });
});
