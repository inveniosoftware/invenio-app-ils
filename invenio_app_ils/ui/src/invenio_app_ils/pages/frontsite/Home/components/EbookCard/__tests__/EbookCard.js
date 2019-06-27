import React from 'react';
import { mount } from 'enzyme';
import EbookCard from '../EbookCard';

describe('EbookCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const ebookData = {
    eitem_pid: '123',
    title: 'Lorem',
    authors: 'Author1, Author2',
    imageSize: 'small',
    imageCover: '',
    eitems: [],
    onClick: jest.fn(),
  };

  it('should render the document correctly', () => {
    component = mount(<EbookCard ebookData={ebookData} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('EbookCard')
      .find('Card')
      .filterWhere(
        element => element.prop('data-test') === ebookData.eitem_pid
      );
    expect(rows).toHaveLength(1);
  });
});
