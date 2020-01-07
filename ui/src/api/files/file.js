import { http, apiConfig } from '../base';
import { serializer } from './serializer';

const filesURL = `/files/`;

const downloadURL = (bucket, filename) => {
  return `${apiConfig.baseURL}${filesURL}${bucket}/${filename}?download`;
};

const del = async (bucket, filename) => {
  const response = await http.delete(`${filesURL}${bucket}/${filename}`);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const upload = async (bucket, file) => {
  const headers = {
    headers: {
      'Content-Type': (file.type || '').indexOf('/') > -1 ? file.type : '',
    },
  };
  const response = await http.put(
    `${filesURL}${bucket}/${file.name}`,
    file,
    headers
  );
  response.data = serializer.fromJSON(response.data);
  response.data.bucket = bucket;
  return response;
};

export const file = {
  filesBaseURL: filesURL,
  downloadURL: downloadURL,
  delete: del,
  upload: upload,
};
