import { recordToPidType } from '@api/utils';

export const add = (referrer, relatedList, relationType, extra = {}) => {
  // this is extremely ugly, but fixing it requires heavy refactoring of relations
  const parent = relatedList[0];
  const children = [referrer];

  return children.map(child => ({
    parent_pid_value: parent.metadata.pid,
    parent_pid_type: recordToPidType(parent),
    child_pid_value: child.metadata.pid,
    child_pid_type: recordToPidType(child),
    relation_type: relationType,
    ...extra,
  }));
};

export const remove = (referrer, relation, relationType) => {
  // this is extremely ugly, but fixing it requires heavy refactoring of relations
  const parent = relation;
  const child = referrer;

  return {
    parent_pid_value: parent.pid_value,
    parent_pid_type: parent.pid_type,
    child_pid_value: child.metadata.pid,
    child_pid_type: recordToPidType(child),
    relation_type: relationType,
  };
};
