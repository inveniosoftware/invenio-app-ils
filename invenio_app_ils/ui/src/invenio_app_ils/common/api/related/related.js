import { http } from '../base';
import { serializer } from './serializer';

const getUrl = (pid, pidType) => {
  switch (pidType) {
    case 'docid':
      return `/documents/${pid}/relations`;
    case 'serid':
      return `/series/${pid}/relations`;
    default:
      throw Error(`Invalid PID type: ${pidType}`);
  }
};

const get = (pid, pidType) => {
  return http.get(getUrl(pid, pidType)).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const post = async (pid, pidType, data) => {
  const response = await http.post(getUrl(pid, pidType), data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

export const related = {
  get: get,
  post: post,
  serializer: serializer,
  url: getUrl,
};
