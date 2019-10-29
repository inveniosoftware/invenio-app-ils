import { sessionManager } from '../../../../../../../authentication/services';

const changedObject = () => ({
  by: {
    type: 'user_id',
    value: `${sessionManager.user.id}`,
  },
  timestamp: `${new Date().getTime()}`,
});

export default (values, newRecord) => {
  const submitValues = { ...values };

  if (newRecord) {
    submitValues.created = changedObject();
  } else {
    submitValues.updated = changedObject();
  }

  if (submitValues.tags) {
    submitValues.tag_pids = submitValues.tags.map(tag => tag.pid);
  }

  delete submitValues.tags;
  delete submitValues.circulation;
  delete submitValues.eitems;
  delete submitValues.items;
  delete submitValues.relations;
  delete submitValues._access;

  return submitValues;
};
