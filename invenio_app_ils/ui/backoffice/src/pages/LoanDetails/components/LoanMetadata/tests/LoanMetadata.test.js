import React from 'react';
import { mount } from 'enzyme';
import { LoanMetadata } from '../LoanMetadata';

const defaultProps = {
  data: {
    metadata: {
      title: 'title',
      author: 'author',
    },
  },
};
describe('LoanMetadata', () => {
  let component;

  afterEach(() => {
    component.unmount();
  });

  it('should render initial state and check props', () => {
    component = mount(<LoanMetadata {...defaultProps} />);
    expect(component).toMatchSnapshot();

    Object.keys(defaultProps).forEach(key =>
      expect(component.props()[key]).toEqual(defaultProps[key])
    );
  });

  it('should create a div for each loan property', () => {
    component = mount(<LoanMetadata {...defaultProps} />);
    const rowComponents = component.find('div[name="loan-field"]');
    expect(rowComponents).toHaveLength(
      Object.keys(defaultProps.data.metadata).length
    );
  });
});
