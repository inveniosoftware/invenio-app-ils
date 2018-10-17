import React from 'react';
import { shallow } from 'enzyme';
import LoanMetadata from '../LoanMetadata';

describe('LoanMetadata component', () => {
  it('renders initial state', () => {
    const data = {
      metadata: {},
    };
    const component = shallow(<LoanMetadata data={data} />);
    expect(component).toMatchSnapshot();
  });

  it('renders data', () => {
    const data = {
      metadata: {
        title: 'title',
        author: 'author',
      },
    };
    const component = shallow(<LoanMetadata data={data} />);
    expect(component).toMatchSnapshot();
  });
});
