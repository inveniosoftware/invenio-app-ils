export default values => {
  const submit = { ...values };

  submit.document_pid = submit.document.pid;
  delete submit.document;

  submit.internal_location_pid = submit.internal_location.pid;
  delete submit.internal_location;

  return submit;
};
