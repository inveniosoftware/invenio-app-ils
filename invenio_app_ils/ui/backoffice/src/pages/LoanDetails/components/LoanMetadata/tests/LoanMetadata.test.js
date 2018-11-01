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
describe('tests LoanMetadata component', () => {
  let component;

  afterEach(() => {
    component.unmount();
  });

  it('renders initial state and checks the props are passed', () => {
    component = mount(<LoanMetadata {...defaultProps} />);
    expect(component).toMatchSnapshot();

    Object.keys(defaultProps).forEach(key =>
      expect(component.props()[key]).toEqual(defaultProps[key])
    );
  });

  it('creates a div for each property in data.metadata', () => {
    component = mount(<LoanMetadata {...defaultProps} />);
    const rowComponents = component.find('div[name="loan-field"]');
    expect(rowComponents).toHaveLength(
      Object.keys(defaultProps.data.metadata).length
    );
  });
});
