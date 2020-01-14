import { formatPidTypeToName } from '@pages/backoffice/components/ManageRelationsButton/utils';

export const getSelections = (relationName, relations) => {
  const selections = [];
  if (relations[relationName]) {
    const relations = relations[relationName];

    for (const obj of relations) {
      const id = `${obj.pid}-${obj.pid_type}-${relationName}`;
      const type = formatPidTypeToName(obj.pid_type);
      const extraFields = {};
      for (const key in obj) {
        if (!['pid', 'pid_type', 'title'].includes(key)) {
          extraFields[key] = obj[key];
        }
      }
      selections.push({
        id: id,
        key: id,
        title: obj.title,
        description: `${relationName}`,
        extra: `${type} #${obj.pid}`,
        metadata: {
          pid: obj.pid,
          pidType: obj.pid_type,
          relationType: relationName,
          title: obj.title,
          extraFields: extraFields,
        },
      });
    }
  }
  return selections;
};
