import { schemaToPidType } from '../../api/utils';

const formatPid = pid => `PID: ${pid}`;

export const serializeError = error => ({
  id: 'error',
  key: 'error',
  title: error.toString(),
  description: 'Failed to retrieve search results.',
  extra: '',
});

export const serializeDocument = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.title,
  description: metadata.authors
    ? `Authors: ${metadata.authors.join(', ')}`
    : 'Document',
  extra: formatPid(metadata.pid),
  metadata: metadata,
});

export const serializeEItem = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.document.title.title,
  description: `Open access: ${metadata.open_access ? 'Yes' : 'No'}`,
  extra: formatPid(metadata.pid),
  metadata: metadata,
});

export const serializeInternalLocation = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.name,
  description: metadata.location ? `Location: ${metadata.location.name}` : null,
  extra: formatPid(metadata.pid),
  metadata: metadata,
});

export const serializeItem = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.medium,
  description: metadata.shelf ? `Shelf: ${metadata.shelf}` : null,
  extra: formatPid(metadata.pid),
  metadata: metadata,
});

export const serializeKeyword = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.name,
  description: metadata.provenance
    ? `Provenance: ${metadata.provenance}`
    : null,
  extra: formatPid(metadata.pid),
  metadata: metadata,
});

export const serializeLoan = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.state,
  description: metadata.document_pid
    ? `Document PID: ${metadata.document_pid}`
    : null,
  extra: formatPid(metadata.pid),
  metadata: metadata,
});

export const serializeLocation = metadata => ({
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.name,
  description: metadata.address ? `Address: ${metadata.address}` : null,
  extra: formatPid(metadata.pid),
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
  id: metadata.pid,
  key: metadata.pid,
  title: metadata.title.title,
  description: metadata.mode_of_issuance
    ? `Mode of Issuance: ${metadata.mode_of_issuance}`
    : null,
  extra: `ID: ${metadata.pid}`,
  metadata: metadata,
});

export const serializeHit = hit => {
  const { metadata } = hit;
  const pidType = schemaToPidType(metadata['$schema']);

  switch (pidType) {
    case 'docid':
      return serializeDocument(metadata);
    case 'eitmid':
      return serializeEItem(metadata);
    case 'ilocid':
      return serializeInternalLocation(metadata);
    case 'keyid':
      return serializeKeyword(metadata);
    case 'loanid':
      return serializeLoan(metadata);
    case 'locid':
      return serializeLocation(metadata);
    case 'pitmid':
      return serializeItem(metadata);
    case 'patid':
      return serializePatron(metadata);
    case 'serid':
      return serializeSeries(metadata);
    default:
      console.warn('failed to serialize hit: unknown pidType ', pidType);
  }
};

export const serializeAccessList = email => ({
  id: email,
  key: email,
  title: email,
});
