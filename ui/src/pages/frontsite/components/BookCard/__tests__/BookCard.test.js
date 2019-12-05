import React from 'react';
import { mount } from 'enzyme';
import testData from '@testData/documents.json';
import { FrontSiteRoutes } from '@routes/urls';
import history from '@history';
import { BookCard } from '../BookCard';

describe('BookCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const bookData = {
    metadata: {
      ...testData[0],
      title: 'Lorem',
      edition: '12',
      authors: ['Author1', 'Author2'],
      imageSize: 'small',
      imageCover: '',
      circulation: { has_items_for_loan: 2 },
      eitems: { total: 2 },
    },
  };

  it('should render the BookCard', () => {
    component = mount(<BookCard data={bookData} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('BookCard')
      .find('Card')
      .filterWhere(
        element => element.prop('data-test') === bookData.metadata.pid
      );
    expect(rows).toHaveLength(1);
  });

  it('should go to book details when clicking on a book', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    component = mount(<BookCard data={bookData} />);
    expect(component).toMatchSnapshot();
    const card = component.find('BookCard');
    card.simulate('click');
    const expectedParam = FrontSiteRoutes.documentDetailsFor(
      bookData.metadata.pid
    );
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
