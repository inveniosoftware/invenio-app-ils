import { http } from '../base';
import { serializer } from './serializer';

const tagURL = '/tags/';

const list = query => {
  return http.get(`${tagURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

export const tag = {
  list: list,
  serializer: serializer,
  url: tagURL,
};
