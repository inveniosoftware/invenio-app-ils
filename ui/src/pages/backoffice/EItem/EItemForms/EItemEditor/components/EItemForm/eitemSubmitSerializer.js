export default values => {
  const submitValues = { ...values };
  submitValues.document_pid = submitValues.document.pid;
  delete submitValues['document'];
  return submitValues;
};
