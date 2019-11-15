import React from 'react';
import { shallow, mount } from 'enzyme';
import PatronDetails from '../PatronDetails';

jest.mock('../components/', () => {
  return {
    ItemsCheckout: () => null,
    ItemsSearch: () => null,
    PatronCurrentLoans: () => null,
    PatronDocumentRequests: () => null,
    PatronMetadata: () => null,
    PatronPendingLoans: () => null,
  };
});

describe('PatronDetails tests', () => {
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
      patronPid: 1,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <PatronDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchPatronDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch patron details on mount', () => {
    const mockedFetchPatronDetails = jest.fn();
    component = mount(
      <PatronDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchPatronDetails={mockedFetchPatronDetails}
      />
    );
    expect(mockedFetchPatronDetails).toHaveBeenCalledWith(
      routerUrlParams.params.patronPid
    );
  });
});
