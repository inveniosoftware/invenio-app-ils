import { sessionManager } from '@authentication/services';

const changedObject = () => ({
  type: 'user_id',
  value: `${sessionManager.user.id}`,
});

export default (values, newRecord) => {
  const submitValues = { ...values };

  if (newRecord) {
    submitValues.created_by = changedObject();
  } else {
    submitValues.updated_by = changedObject();
  }

  delete submitValues.circulation;
  delete submitValues.eitems;
  delete submitValues.items;
  delete submitValues.relations;
  delete submitValues._access;

  return submitValues;
};
