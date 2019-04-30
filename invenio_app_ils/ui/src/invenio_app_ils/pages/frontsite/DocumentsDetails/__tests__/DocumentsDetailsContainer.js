import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentsDetailsContainer from '../DocumentsDetailsContainer';
jest.mock('../components/DocumentsDetails', () => {
  return {
    DocumentsDetails: () => null,
  };
});

describe('DocumentsDetailsContainer tests', () => {
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
      <DocumentsDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentsDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch item details on mount', () => {
    const mockedFetchDocumentsDetails = jest.fn();
    component = mount(
      <DocumentsDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchDocumentsDetails={mockedFetchDocumentsDetails}
      />
    );
    expect(mockedFetchDocumentsDetails).toHaveBeenCalledWith(
      routerUrlParams.params.documentPid
    );
  });
});
