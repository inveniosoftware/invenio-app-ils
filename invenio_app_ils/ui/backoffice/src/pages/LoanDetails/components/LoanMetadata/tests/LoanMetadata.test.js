import React from 'react';
import { mount } from 'enzyme';
import { LoanMetadata } from '../LoanMetadata';

const LOAN_METADATA_DEFAULT_PROPS = {
  data: {
    metadata: {
      title: 'title',
      author: 'author',
    },
  },
};
describe('LoanMetadata component', () => {
  let component;

  afterEach(() => {
    component.unmount();
  });

  it('renders initial state and checks the props are passed', () => {
    component = mount(<LoanMetadata {...LOAN_METADATA_DEFAULT_PROPS} />);
    expect(component).toMatchSnapshot();

    Object.keys(LOAN_METADATA_DEFAULT_PROPS).forEach(key =>
      expect(component.props()[key]).toEqual(LOAN_METADATA_DEFAULT_PROPS[key])
    );
  });

  it('creates a div for each property in data.metadata', () => {
    component = mount(<LoanMetadata {...LOAN_METADATA_DEFAULT_PROPS} />);
    const rowComponents = component.find('div[name="loan-field"]');
    expect(rowComponents).toHaveLength(
      Object.keys(LOAN_METADATA_DEFAULT_PROPS.data.metadata).length
    );
  });
});
