import { recordToPidType } from '@api/utils';

export const add = (referrer, relatedList, relationType, extra = {}) => {
  // this should not exist and should be refactored when backend refactored
  const relationOrder = extra.relation_order;

  let previous, next;
  if (relationOrder === 'is_continued_by') {
    previous = referrer;
    next = relatedList[0];
  } else if (relationOrder === 'continues') {
    previous = relatedList[0];
    next = referrer;
  } else {
    throw TypeError(`Unknown relation order ${relationOrder}`);
  }

  return {
    previous_pid_value: previous.metadata.pid,
    previous_pid_type: recordToPidType(previous),
    next_pid_value: next.metadata.pid,
    next_pid_type: recordToPidType(next),
    relation_type: relationType,
  };
};

export const remove = (referrer, relation, relationType) => {
  // this should not exist and should be refactored when backend refactored
  const relationOrder = relation.relation_order;

  if (relationOrder === 'is_continued_by') {
    return {
      previous_pid_value: referrer.metadata.pid,
      previous_pid_type: recordToPidType(referrer),
      next_pid_value: relation.pid_value,
      next_pid_type: relation.pid_type,
      relation_type: relationType,
    };
  } else if (relationOrder === 'continues') {
    return {
      previous_pid_value: relation.pid_value,
      previous_pid_type: relation.pid_type,
      next_pid_value: referrer.metadata.pid,
      next_pid_type: recordToPidType(referrer),
      relation_type: relationType,
    };
  } else {
    throw TypeError(`Unknown relation order ${relationOrder}`);
  }
};
