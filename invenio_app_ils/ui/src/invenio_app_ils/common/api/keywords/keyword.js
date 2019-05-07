import { http } from '../base';
import { serializer } from './serializer';

const keywordURL = '/keywords/';

const list = query => {
  return http.get(`${keywordURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

export const keyword = {
  list: list,
  serializer: serializer,
  url: keywordURL,
};
