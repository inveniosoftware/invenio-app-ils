import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import LoansCard from '../LoansCard';

jest.mock('../../../../../../../common/config');

Settings.defaultZoneName = 'utc';

describe('LoansCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const mockedFetchLoans = jest.fn();

    const component = shallow(
      <LoansCard data={0} fetchPendingLoans={mockedFetchLoans} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render stats with 2 records', () => {
    const mockedFetchLoans = jest.fn();
    const data = 2;

    component = mount(
      <LoansCard data={data} fetchPendingLoans={mockedFetchLoans} />
    );

    expect(component).toMatchSnapshot();
    const stats = component.find('span').prop('data-test');
    expect(stats).toEqual(data);
  });
});
