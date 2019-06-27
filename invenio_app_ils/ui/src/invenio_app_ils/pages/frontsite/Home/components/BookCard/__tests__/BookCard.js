import React from 'react';
import { mount } from 'enzyme';
import BookCard from '../BookCard';

describe('BookCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const bookData = {
    pid: '123',
    title: 'Lorem',
    authors: 'Author1, Author2',
    imageSize: 'small',
    imageCover: '',
    eitems: [],
    onClick: jest.fn(),
  };

  it('should render the document correctly', () => {
    component = mount(<BookCard bookData={bookData} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('BookCard')
      .find('Card')
      .filterWhere(element => element.prop('data-test') === bookData.pid);
    expect(rows).toHaveLength(1);
  });
});
