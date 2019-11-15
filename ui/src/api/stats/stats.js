import { http } from '../base';
const statsURL = '/stats';

const recordStats = async (pidType, pidValue) => {
  const data = {
    views: {
      stat: 'record-view',
      params: {
        pid_type: pidType,
        pid_value: pidValue,
      },
    },
  };
  return await http.post(statsURL, data);
};

export const stats = {
  recordStats: recordStats,
};
