import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

beforeEach(() => {
  window.history.pushState({}, 'Backoffice page title', '/backoffice');
});

it('should render backoffice application', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
