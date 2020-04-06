import { http } from '@api/base';
import {
  add as addParentChild,
  remove as removeParentChild,
} from './parentChild';
import { add as addSibling, remove as removeSibling } from './siblings';
import { add as addSequence, remove as removeSequence } from './sequence';

// this should be refactored at some point and this file should disappear.
// the specific APIs parentChild, sequence and siblings should be used instead.

const relationsURL = '/relations';

const apiSelector = relationType => {
  const isParentChild = ['serial', 'multipart_monograph'].includes(
    relationType
  );
  const isSibling = ['language', 'edition', 'other'].includes(relationType);
  const isSequence = ['sequence'].includes(relationType);

  let payload;
  if (isParentChild) {
    payload = {
      add: addParentChild,
      remove: removeParentChild,
    };
  } else if (isSibling) {
    payload = {
      add: addSibling,
      remove: removeSibling,
    };
  } else if (isSequence) {
    payload = {
      add: addSequence,
      remove: removeSequence,
    };
  } else {
    throw TypeError(`Unknown relation type ${relationType}`);
  }
  return payload;
};

export const add = async (
  url,
  referrer,
  relatedList,
  relationType,
  extra = {}
) => {
  const api = apiSelector(relationType);
  const payload = api.add(referrer, relatedList, relationType, extra);
  return await http.post(`${url}${relationsURL}`, payload);
};

export const remove = async (url, referrer, relation, relationType) => {
  const api = apiSelector(relationType);
  const payload = api.remove(referrer, relation, relationType);
  return await http.delete(`${url}${relationsURL}`, { data: payload });
};
