import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const goTo = path => e => {
  history.push(path);
};

export default history;
