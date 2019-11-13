import React from 'react';
import { shallow, mount } from 'enzyme';
import RecordsBriefCard from '../RecordsBriefCard';
import { Button, Icon } from 'semantic-ui-react';

describe('RecordsBriefCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const component = shallow(
      <RecordsBriefCard title={'Test'} stats={3} text={'test test test'} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render with buttons', () => {
    let button = (
      <Button fluid icon positive>
        <Icon name="plus" />
        New
      </Button>
    );
    component = mount(
      <RecordsBriefCard
        title={'Test'}
        stats={3}
        text={'test test test'}
        buttonRight={button}
        buttonLeft={button}
      />
    );

    const testButton = component.find('Button');

    expect(component).toMatchSnapshot();
    expect(testButton).toHaveLength(2);
  });

  it('should render without buttons', () => {
    component = mount(
      <RecordsBriefCard title={'Test'} stats={3} text={'test test test'} />
    );

    const testButton = component.find('Button');

    expect(component).toMatchSnapshot();
    expect(testButton).toHaveLength(0);
  });
});
