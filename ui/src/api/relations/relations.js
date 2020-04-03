import { http } from '@api/base';
import {
  add as parentChildAdd,
  remove as parentChildRemove,
} from './parentChild';
import { add as siblingsAdd, remove as siblingsRemove } from './siblings';
import { add as sequenceAdd, remove as sequenceRemove } from './sequence';

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
      add: parentChildAdd,
      remove: parentChildRemove,
    };
  } else if (isSibling) {
    payload = {
      add: siblingsAdd,
      remove: siblingsRemove,
    };
  } else if (isSequence) {
    payload = {
      add: sequenceAdd,
      remove: sequenceRemove,
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
