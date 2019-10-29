import { getIn } from 'formik';

export default values => {
  const submit = { ...values };

  submit.document_pid = getIn(submit, 'document.pid');
  delete submit.document;

  submit.internal_location_pid = getIn(submit, 'internal_location.pid');
  delete submit.internal_location;

  return submit;
};
