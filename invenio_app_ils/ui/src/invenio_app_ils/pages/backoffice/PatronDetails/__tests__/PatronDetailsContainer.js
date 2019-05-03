import React from 'react';
import { shallow, mount } from 'enzyme';
import PatronDetailsContainer from '../PatronDetailsContainer';

jest.mock('../../../../common/config');

jest.mock('../components/PatronDetails', () => {
  return {
    PatronDetails: () => null,
  };
});

describe('PatronDetailsContainer tests', () => {
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
      <PatronDetailsContainer
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
      <PatronDetailsContainer
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
