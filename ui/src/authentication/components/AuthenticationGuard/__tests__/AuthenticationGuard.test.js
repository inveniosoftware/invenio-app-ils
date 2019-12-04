import { shallow, mount } from 'enzyme/build';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationGuard from '../AuthenticationGuard';
import { Button } from 'semantic-ui-react';

describe('AuthenticationGuard tests', () => {
  let component;
  let Authorized = props => 'Authorized';
  let UnAuthorized = props => 'UnAuthorized';

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should return null if the user fetching is in progress', () => {
    const component = mount(
      <AuthenticationGuard isLoading={true} authorizedComponent={Authorized} />
    );
    expect(component.html()).toBeNull();
  });

  it('should redirect if user is anonymous and login component is not passed', () => {
    component = mount(
      <BrowserRouter>
        <AuthenticationGuard
          isLoading={false}
          isAnonymous={true}
          authorizedComponent={Authorized}
        />
      </BrowserRouter>
    );

    const redirected = component.find('Redirect');

    expect(redirected).toHaveLength(1);
  });

  it('should render login component if user is anonymous and login component is passed', () => {
    const loginComponent = () => <Button data-test="login">Login</Button>;
    component = mount(
      <AuthenticationGuard
        isLoading={false}
        isAnonymous={true}
        loginComponent={loginComponent}
        authorizedComponent={Authorized}
      />
    );

    const redirected = component
      .find('Button')
      .filterWhere(element => element.prop('data-test') === 'login');

    expect(redirected).toHaveLength(1);
  });

  it('should return null if user is logged in, roles are not sufficient and unauthorized component was not provided', () => {
    const mockSendErrorNotification = jest.fn();
    component = mount(
      <AuthenticationGuard
        isAnonymous={false}
        sendErrorNotification={mockSendErrorNotification}
        user={{ roles: ['notadmin'] }}
        roles={['admin']}
        authorizedComponent={Authorized}
      />
    );
    expect(component.html()).toBeNull();
    expect(mockSendErrorNotification).toHaveBeenCalled();
  });

  it('should return unauthorized component if user is logged in, roles are not sufficient and unauthorized component was provided', () => {
    const mockSendErrorNotification = jest.fn();
    component = mount(
      <AuthenticationGuard
        isAnonymous={false}
        sendErrorNotification={mockSendErrorNotification}
        user={{ roles: ['notadmin'] }}
        roles={['admin']}
        unAuthorizedComponent={UnAuthorized}
        authorizedComponent={Authorized}
      />
    );
    let unAuthorized = component.find('UnAuthorized');
    expect(unAuthorized).toHaveLength(1);
    expect(component.html()).toBe('UnAuthorized');
    expect(mockSendErrorNotification).toHaveBeenCalled();
  });

  it('should return authorized component if user is logged in and roles are sufficient', () => {
    const mockSendErrorNotification = jest.fn();
    component = mount(
      <AuthenticationGuard
        isAnonymous={false}
        sendErrorNotification={mockSendErrorNotification}
        user={{ roles: ['admin'] }}
        roles={['admin']}
        unAuthorizedComponent={UnAuthorized}
        authorizedComponent={Authorized}
      />
    );
    let authorized = component.find('Authorized');
    expect(authorized).toHaveLength(1);
    expect(component.html()).toBe('Authorized');
    expect(mockSendErrorNotification).not.toHaveBeenCalled();
  });
});
