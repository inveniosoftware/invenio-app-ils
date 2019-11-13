import { mount, shallow } from 'enzyme';
import React from 'react';
import EItemDetails from '../EItemDetails';

describe('EItemDetails tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const routerUrlParams = {
    params: {
      eitemPid: 111,
    },
  };

  it('should load the details component', () => {
    const component = shallow(
      <EItemDetails
        match={routerUrlParams}
        fetchEItemDetails={() => {}}
        isLoading={true}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch eitem details on mount', () => {
    const mockedFetchEItemDetails = jest.fn();
    component = mount(
      <EItemDetails
        match={routerUrlParams}
        fetchEItemDetails={mockedFetchEItemDetails}
        isLoading={true}
      />
    );
    expect(mockedFetchEItemDetails).toHaveBeenCalledWith(
      routerUrlParams.params.eitemPid
    );
  });
});
