import { http } from '../base';
import { serializer } from './serializer';

const getUrl = (pid, pidType, size) => {
  const sizeParam = size ? `?size=${size}` : '';
  switch (pidType) {
    case 'docid':
      return `/documents/${pid}/relations${sizeParam}`;
    case 'serid':
      return `/series/${pid}/relations${sizeParam}`;
    default:
      throw Error(`Invalid PID type: ${pidType}`);
  }
};

const get = (pid, pidType, size) => {
  return http.get(getUrl(pid, pidType, size)).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const post = async (pid, pidType, data, size) => {
  const response = await http.post(getUrl(pid, pidType, size), data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

export const related = {
  get: get,
  post: post,
  serializer: serializer,
  url: getUrl,
};
