import { http } from '../base';
const statsURL = '/stats';

const recordStats = (pidType, pidValue) => {
  const data = {
    views: {
      stat: 'record-view',
      params: {
        pid_type: pidType,
        pid_value: pidValue,
      },
    },
    downloads: {
      stat: 'file-download-by-document',
      params: {
        document_pid: pidValue,
      },
    },
  };
  return http.post(statsURL, data);
};

export const stats = {
  recordStats: recordStats,
};
