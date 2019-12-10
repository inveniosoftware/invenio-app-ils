import React from 'react';
import { shallow, mount } from 'enzyme';
import BorrowingRequestDetails from '../BorrowingRequestDetails';

jest.mock('../components/', () => {
  return {
    BorrowingRequestMetadata: () => null,
  };
});

describe('BorrowingRequestDetails tests', () => {
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
      <BorrowingRequestDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchBorrowingRequestDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch borrowingRequest details on mount', () => {
    const mockedFetchBorrowingRequests = jest.fn();
    component = mount(
      <BorrowingRequestDetails
        history={routerHistory}
        match={routerUrlParams}
        fetchBorrowingRequestDetails={mockedFetchBorrowingRequests}
      />
    );
    expect(mockedFetchBorrowingRequests).toHaveBeenCalled();
  });
});
