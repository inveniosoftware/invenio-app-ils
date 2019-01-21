import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentDetailsContainer from '../DocumentDetailsContainer';
jest.mock('../components/DocumentDetails', () => {
  return {
    DocumentDetails: () => null,
  };
});

describe('DocumentDetailsContainer tests', () => {
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
      <DocumentDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchDocumentDetails = jest.fn();
    component = mount(
      <DocumentDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentDetails={mockedFetchDocumentDetails}
      />
    );
    expect(mockedFetchDocumentDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});
