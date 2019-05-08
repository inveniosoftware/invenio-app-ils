import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { AuthenticationGuard } from '../AuthenticationGuard';
import { Button } from 'semantic-ui-react';

describe('AuthenticationGuard tests', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the AuthenticationGuard component', () => {
    const authorizedButton = () => {
      return (
        <Button size="small" onClick={() => {}}>
          Authorized
        </Button>
      );
    };
    const unAuthorizedButton = () => {
      return (
        <Button size="small" onClick={() => {}} data-test="unauthorized">
          Unauthorized
        </Button>
      );
    };
    const component = shallow(
      <AuthenticationGuard
        authorizedComponent={authorizedButton}
        unAuthorizedComponent={unAuthorizedButton}
        roles={['test']}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render the UnAuthorized component when user does not have the needed roles', () => {
    const authorizedButton = () => {
      return (
        <Button size="small" onClick={() => {}}>
          Authorized
        </Button>
      );
    };
    const unAuthorizedButton = () => {
      return (
        <Button size="small" onClick={() => {}} data-test="unauthorized">
          Unauthorized
        </Button>
      );
    };
    component = mount(
      <AuthenticationGuard
        authorizedComponent={authorizedButton}
        unAuthorizedComponent={unAuthorizedButton}
        roles={['not_allowed']}
      />
    );

    expect(component).toMatchSnapshot();
    const unAuthorized = component
      .find('Button')
      .filterWhere(element => element.prop('data-test') === 'unauthorized');
    expect(unAuthorized).toHaveLength(1);
  });

  it('should render the Authorized component when user does not have the needed roles', () => {
    const authorizedButton = () => {
      return (
        <Button size="small" onClick={() => {}} data-test="authorized">
          Authorized
        </Button>
      );
    };
    const unAuthorizedButton = () => {
      return (
        <Button size="small" onClick={() => {}} data-test="unauthorized">
          Unauthorized
        </Button>
      );
    };
    component = mount(
      <AuthenticationGuard
        authorizedComponent={authorizedButton}
        unAuthorizedComponent={unAuthorizedButton}
        roles={['test']}
      />
    );

    expect(component).toMatchSnapshot();
    const unAuthorized = component
      .find('Button')
      .filterWhere(element => element.prop('data-test') === 'authorized');
    expect(unAuthorized).toHaveLength(1);
  });
});
