import React from 'react';
import { shallow, mount } from 'enzyme';
import UserDetailsContainer from '../UserDetailsContainer';
jest.mock('../components/UserDetails', () => {
  return {
    UserDetails: () => null,
  };
});

describe('UserDetailsContainer tests', () => {
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
      userPid: 1,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <UserDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchUserDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch user details on mount', () => {
    const mockedFetchUserDetails = jest.fn();
    component = mount(
      <UserDetailsContainer
        history={routerHistory}
        match={routerUrlParams}
        fetchUserDetails={mockedFetchUserDetails}
      />
    );
    expect(mockedFetchUserDetails).toHaveBeenCalledWith(
      routerUrlParams.params.userPid
    );
  });
});
