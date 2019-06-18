import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const goToHandler = path => e => {
  history.push(path);
};

export const goTo = (path, state = {}) => {
  history.push(path, state);
};

export default history;
