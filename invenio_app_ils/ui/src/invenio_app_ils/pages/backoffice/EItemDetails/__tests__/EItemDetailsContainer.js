import React from 'react';
import { shallow, mount } from 'enzyme';
import EItemDetailsContainer from '../EItemDetailsContainer';

jest.mock('../../../../common/config');

jest.mock('../components/EItemDetails', () => {
  return {
    EItemDetails: () => null,
  };
});

describe('EItemDetailsContainer tests', () => {
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
      <EItemDetailsContainer
        match={routerUrlParams}
        fetchEItemDetails={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch eitem details on mount', () => {
    const mockedFetchEItemDetails = jest.fn();
    component = mount(
      <EItemDetailsContainer
        match={routerUrlParams}
        fetchEItemDetails={mockedFetchEItemDetails}
      />
    );
    expect(mockedFetchEItemDetails).toHaveBeenCalledWith(
      routerUrlParams.params.eitemPid
    );
  });
});
