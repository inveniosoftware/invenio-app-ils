import { recordToPidType } from '@api/utils';

export const add = (_, relatedList, relationType, extra = {}) => {
  const siblings = relatedList;

  return siblings.map(second => ({
    pid_value: second.metadata.pid,
    pid_type: recordToPidType(second),
    relation_type: relationType,
    ...extra,
  }));
};

export const remove = (_, relation, relationType) => {
  return {
    pid_value: relation.pid_value,
    pid_type: relation.pid_type,
    relation_type: relationType,
  };
};
