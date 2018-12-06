const getInvenioConfig = () => {
  const element = document.getElementById('invenio-config');
  const jsonString = element ? element.getAttribute('data-config') : '{}';
  const json = JSON.parse(jsonString);
  console.debug('Invenio config', json);
  return json;
};

export const invenioConfig = getInvenioConfig();
