import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const goTo = (path, state = {}) => {
  history.push(path, state);
};

export default history;
