import React from 'react';
import { mount } from 'enzyme';
import { DateRangePicker } from '../DateRangePicker';

describe('DocumentMetadata tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const mockedChangeDates = jest.fn();

  it('should render Date Range Picker', () => {
    component = mount(
      <DateRangePicker
        handleDateChange={mockedChangeDates}
        defaultStart={'2019-09-03'}
        defaultEnd={'2019-10-03'}
      />
    );
    expect(component).toMatchSnapshot();

    const date = component
      .find('DateRangePicker')
      .find('DateInput')
      .filterWhere(element => element.prop('data-test') === '2019-09-03');
    expect(date).toHaveLength(1);
  });
});
