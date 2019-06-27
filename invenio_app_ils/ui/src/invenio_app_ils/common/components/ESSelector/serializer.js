const formatPid = pid => `PID: ${pid}`;

export const serializeError = error => ({
  id: 'error',
  key: 'error',
  title: error.toString(),
  description: 'Failed to retrieve search results.',
  extra: '',
});

export const serializeDocument = metadata => ({
  id: metadata.document_pid,
  key: metadata.document_pid,
  title: metadata.title,
  description: metadata.authors
    ? `Authors: ${metadata.authors.join(', ')}`
    : 'Document',
  extra: formatPid(metadata.document_pid),
  metadata: metadata,
});

export const serializeEItem = metadata => ({
  id: metadata.eitem_pid,
  key: metadata.eitem_pid,
  title: metadata.document.title,
  description: `Open access: ${metadata.open_access ? 'Yes' : 'No'}`,
  extra: formatPid(metadata.eitem_pid),
  metadata: metadata,
});

export const serializeInternalLocation = metadata => ({
  id: metadata.internal_location_pid,
  key: metadata.internal_location_pid,
  title: metadata.name,
  description: metadata.location ? `Location: ${metadata.location.name}` : null,
  extra: formatPid(metadata.internal_location_pid),
  metadata: metadata,
});

export const serializeItem = metadata => ({
  id: metadata.item_pid,
  key: metadata.item_pid,
  title: metadata.medium,
  description: metadata.shelf ? `Shelf: ${metadata.shelf}` : null,
  extra: formatPid(metadata.item_pid),
  metadata: metadata,
});

export const serializeKeyword = metadata => ({
  id: metadata.keyword_pid,
  key: metadata.keyword_pid,
  title: metadata.name,
  description: metadata.provenance
    ? `Provenance: ${metadata.provenance}`
    : null,
  extra: formatPid(metadata.keyword_pid),
  metadata: metadata,
});

export const serializeLoan = metadata => ({
  id: metadata.loan_pid,
  key: metadata.loan_pid,
  title: metadata.state,
  description: metadata.document_pid
    ? `Document PID: ${metadata.document_pid}`
    : null,
  extra: formatPid(metadata.loan_pid),
  metadata: metadata,
});

export const serializeLocation = metadata => ({
  id: metadata.location_pid,
  key: metadata.location_pid,
  title: metadata.name,
  description: metadata.address ? `Address: ${metadata.address}` : null,
  extra: formatPid(metadata.location_pid),
  metadata: metadata,
});

export const serializePatron = metadata => ({
  id: metadata.id,
  key: metadata.id,
  title: metadata.email,
  description: metadata.name ? `Name: ${metadata.name}` : null,
  extra: `ID: ${metadata.id}`,
  metadata: metadata,
});

export const serializeSeries = metadata => ({
  id: metadata.series_pid,
  key: metadata.series_pid,
  title: metadata.title,
  description: metadata.mode_of_issuance
    ? `Mode of Issuance: ${metadata.mode_of_issuance}`
    : null,
  extra: `ID: ${metadata.series_pid}`,
  metadata: metadata,
});

export const serializeHit = hit => {
  const { metadata } = hit;
  const schema = metadata['$schema'];

  const hasSchema = text => schema.includes(text);

  let result = {};
  if (schema) {
    if (hasSchema('/schemas/loans/loan-v1')) {
      result = serializeLoan(metadata);
    } else if (hasSchema('/schemas/items/item-v1')) {
      result = serializeItem(metadata);
    } else if (hasSchema('/schemas/documents/document-v1')) {
      result = serializeDocument(metadata);
    } else if (hasSchema('/schemas/eitems/eitem-v1')) {
      result = serializeEItem(metadata);
    } else if (hasSchema('/schemas/internal_locations/internal_location-v1')) {
      result = serializeInternalLocation(metadata);
    } else if (hasSchema('/schemas/locations/location-v1')) {
      result = serializeLocation(metadata);
    } else if (hasSchema('/schemas/keywords/keyword-v1')) {
      result = serializeKeyword(metadata);
    } else if (hasSchema('/schemas/series/series-v1')) {
      result = serializeSeries(metadata);
    } else {
      console.warn('failed to serialize hit: unknown schema ', schema);
    }
  } else {
    // TODO: add a "fake" schema to patrons so we can check the type more easily
    if (metadata.email) {
      result = serializePatron(metadata);
    } else {
      console.warn('failed to serialize hit:', hit);
    }
  }

  return {
    ...result,
  };
};

export const serializeAccessList = email => ({
  id: email,
  key: email,
  title: email,
});
