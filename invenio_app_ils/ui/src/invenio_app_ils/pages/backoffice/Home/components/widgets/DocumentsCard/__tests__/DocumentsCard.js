import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentsCard from '../DocumentsCard';

jest.mock('../../../../../../../common/config');

describe('DocumentsCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const mockedFetchDocuments = jest.fn();

    const component = shallow(
      <DocumentsCard
        data={0}
        fetchRequestedWithAvailableItems={mockedFetchDocuments}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render stats with 2 records', () => {
    const mockedFetchDocuments = jest.fn();
    const data = 2;

    component = mount(
      <DocumentsCard
        data={data}
        fetchRequestedWithAvailableItems={mockedFetchDocuments}
      />
    );

    expect(component).toMatchSnapshot();
    const stats = component.find('span').prop('data-test');
    expect(stats).toEqual(data);
  });
});
