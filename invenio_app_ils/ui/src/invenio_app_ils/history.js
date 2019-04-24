import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const goTo = path => e => {
  history.push(path);
  history.go();
};

export default history;
