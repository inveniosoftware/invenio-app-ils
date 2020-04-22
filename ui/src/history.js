import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen(_ => {
  window.scrollTo(0, 0);
});

export const goTo = (path, state = {}) => {
  history.push(path, state);
};

export default history;
