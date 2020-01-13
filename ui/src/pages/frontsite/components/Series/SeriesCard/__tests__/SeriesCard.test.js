import React from 'react';
import { mount } from 'enzyme';
import testData from '@testData/series.json';
import { FrontSiteRoutes } from '@routes/urls';
import history from '@history';
import { SeriesCard } from '../SeriesCard';

describe('SeriesCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  const seriesData = {
    metadata: {
      ...testData[0],
      title: 'Lorem',
      edition: '12',
      authors: ['Author1', 'Author2'],
      mode_of_issuance: 'SERIAL',
    },
  };

  it('should render the SeriesCard', () => {
    component = mount(<SeriesCard data={seriesData} />);
    expect(component).toMatchSnapshot();

    const rows = component
      .find('SeriesCard')
      .find('Card')
      .filterWhere(
        element => element.prop('data-test') === seriesData.metadata.pid
      );
    expect(rows).toHaveLength(1);
  });

  it('should go to book details when clicking on a book', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;
    component = mount(<SeriesCard data={seriesData} />);
    expect(component).toMatchSnapshot();
    const card = component.find('SeriesCard');
    card.simulate('click');
    const expectedParam = FrontSiteRoutes.seriesDetailsFor(
      seriesData.metadata.pid
    );
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedParam, {});
  });
});
