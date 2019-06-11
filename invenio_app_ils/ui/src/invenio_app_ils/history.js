import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const goToHandler = path => e => {
  history.push(path);
};

export const goTo = path => {
  history.push(path);
};

export default history;
